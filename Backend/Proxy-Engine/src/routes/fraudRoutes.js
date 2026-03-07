import express from 'express';
import FraudReport from '../models/FraudReport.js';
import Email from '../models/Email.js';

const router = express.Router();

router.post('/report', async (req, res) => {
  try {
    const { emailId, reportType, description, reportedBy, severity, indicators } = req.body;

    const email = await Email.findById(emailId);
    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found',
      });
    }

    const report = new FraudReport({
      emailId,
      reportType,
      description,
      reportedBy,
      severity,
      indicators: indicators || [],
    });

    const savedReport = await report.save();

    await Email.findByIdAndUpdate(emailId, {
      isFraudulent: true,
      fraudFlags: [...(email.fraudFlags || []), reportType],
    });

    res.status(201).json({
      success: true,
      data: savedReport,
      message: 'Fraud report created successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, reportType } = req.query;
    const query = {};

    if (status) query.status = status;
    if (reportType) query.reportType = reportType;

    const reports = await FraudReport.find(query)
      .populate('emailId')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await FraudReport.countDocuments(query);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const report = await FraudReport.findById(req.params.id).populate('emailId');
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Fraud report not found',
      });
    }
    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.patch('/:id/resolve', async (req, res) => {
  try {
    const { resolution, resolvedBy, status } = req.body;

    const report = await FraudReport.findByIdAndUpdate(
      req.params.id,
      {
        resolution,
        resolvedBy,
        status: status || 'resolved',
        resolvedAt: Date.now(),
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Fraud report not found',
      });
    }

    res.status(200).json({
      success: true,
      data: report,
      message: 'Report resolved successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
