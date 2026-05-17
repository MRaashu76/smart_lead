import { FilterQuery, SortOrder } from 'mongoose';
import { Lead } from '../models/Lead';
import { AppError } from '../utils/AppError';
import { ILead, PaginatedResponse, LeadQueryParams } from '../interfaces';
import { CreateLeadInput, UpdateLeadInput } from '../validators/lead.validators';

export class LeadService {
  async create(input: CreateLeadInput, createdBy: string): Promise<ILead> {
    const lead = await Lead.create({ ...input, createdBy });
    return lead;
  }

  async findAll(
    params: LeadQueryParams,
    userId: string,
    role: string
  ): Promise<PaginatedResponse<ILead>> {
    const { page = 1, limit = 10, status, source, search, sort = 'latest' } = params;

    const filter: FilterQuery<ILead> = {};

    // Sales users only see their own leads
    if (role === 'sales') {
      filter.createdBy = userId;
    }

    if (status) filter.status = status;
    if (source) filter.source = source;

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const sortOrder: Record<string, SortOrder> =
      sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Lead.find(filter)
        .sort(sortOrder)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email')
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: items as unknown as ILead[],
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    };
  }

  async findById(id: string, userId: string, role: string): Promise<ILead> {
    const lead = await Lead.findById(id).populate('createdBy', 'name email');
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    if (role === 'sales' && lead.createdBy.toString() !== userId) {
      throw new AppError('You do not have permission to view this lead', 403);
    }
    return lead;
  }

  async update(
    id: string,
    input: UpdateLeadInput,
    userId: string,
    role: string
  ): Promise<ILead> {
    const lead = await Lead.findById(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    if (role === 'sales' && lead.createdBy.toString() !== userId) {
      throw new AppError('You do not have permission to update this lead', 403);
    }

    const updated = await Lead.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email');

    if (!updated) throw new AppError('Lead not found', 404);
    return updated;
  }

  async delete(id: string, userId: string, role: string): Promise<void> {
    const lead = await Lead.findById(id);
    if (!lead) {
      throw new AppError('Lead not found', 404);
    }
    if (role === 'sales' && lead.createdBy.toString() !== userId) {
      throw new AppError('You do not have permission to delete this lead', 403);
    }
    await Lead.findByIdAndDelete(id);
  }

  async getStats(userId: string, role: string) {
    const matchStage = role === 'sales' ? { createdBy: userId } : {};
    const [statusCounts, sourceCounts, total] = await Promise.all([
      Lead.aggregate([
        { $match: matchStage },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Lead.aggregate([
        { $match: matchStage },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
      Lead.countDocuments(matchStage),
    ]);

    return { statusCounts, sourceCounts, total };
  }

  async exportAll(userId: string, role: string): Promise<ILead[]> {
    const filter: FilterQuery<ILead> = {};
    if (role === 'sales') filter.createdBy = userId;

    return Lead.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .lean() as unknown as ILead[];
  }
}

export const leadService = new LeadService();
