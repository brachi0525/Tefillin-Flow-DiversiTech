
import { NextFunction, Request, Response } from 'express';
import { reportsService } from '../services/reportsService';

export const getReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reportType, ...filters } = req.query as any;

    if (!reportType) {
      res.status(400).json({
        success: false,
        message: 'reportType is required',
        availableTypes: [
          'soldiers',
          'tefillin',
          'locations',
          'donations',
          'distributions',
          'system',
          'soldier-status'
        ]
      });
    }

    const exists = await reportsService.reportExists(reportType, filters);
    if (!exists) {
      res.status(400).json({
        success: false,
        message: `Invalid report type: ${reportType}`
      });
    }

    const data = await reportsService.getReport(reportType, filters);

    res.json({
      success: true,
      reportType,
      data,
      count: Array.isArray(data) ? data.length : 1,
      filters: filters,
      generatedAt: new Date()
    });

  } catch (error: any) {
    console.error('Report generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

