import { Response, NextFunction } from 'express';
import { leadService } from '../services/lead.service';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { AuthRequest, LeadQueryParams } from '../interfaces';

export class LeadController {
  async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await leadService.create(req.body, req.user!.id);
      sendCreated(res, lead, 'Lead created successfully');
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as LeadQueryParams;
      const result = await leadService.findAll(query, req.user!.id, req.user!.role);
      sendSuccess(res, result, 'Leads fetched');
    } catch (error) {
      next(error);
    }
  }

  async findOne(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await leadService.findById(req.params.id, req.user!.id, req.user!.role);
      sendSuccess(res, lead, 'Lead fetched');
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const lead = await leadService.update(req.params.id, req.body, req.user!.id, req.user!.role);
      sendSuccess(res, lead, 'Lead updated successfully');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await leadService.delete(req.params.id, req.user!.id, req.user!.role);
      sendSuccess(res, null, 'Lead deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await leadService.getStats(req.user!.id, req.user!.role);
      sendSuccess(res, stats, 'Stats fetched');
    } catch (error) {
      next(error);
    }
  }

  async exportCsv(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const leads = await leadService.exportAll(req.user!.id, req.user!.role);

      const headers = ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created At'];
      const rows = leads.map((l) => [
        `"${l.name}"`,
        `"${l.email}"`,
        l.status,
        l.source,
        `"${l.notes ?? ''}"`,
        new Date(l.createdAt).toLocaleDateString(),
      ]);

      const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }
}

export const leadController = new LeadController();
