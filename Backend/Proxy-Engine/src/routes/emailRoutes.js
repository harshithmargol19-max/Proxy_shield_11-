import express from 'express';
import Email from '../models/Email.js';
import { routeEmailToUser } from '../services/emailRouter.js';

const router = express.Router();

router.post('/receive', async (req, res) => {
  try {
    const emailData = req.body;
    
    if (!emailData.to) {
      return res.status(400).json({
        success: false,
        message: 'Recipient (to) is required',
      });
    }

    const email = new Email({
      ...emailData,
      receivedAt: new Date(),
    });
    const savedEmail = await email.save();

    if (!emailData.skipRouting && req.fraudAnalysis && !req.fraudAnalysis.isFraudulent) {
      const routeResult = await routeEmailToUser(emailData);
      
      if (routeResult.success) {
        await Email.findByIdAndUpdate(savedEmail._id, {
          delivered: true,
          proxyEmail: emailData.to,
          realEmail: routeResult.realEmail,
          userId: routeResult.userId,
          shieldIdentityId: routeResult.shieldIdentityId,
        });
      } else {
        await Email.findByIdAndUpdate(savedEmail._id, {
          deliveryError: routeResult.message,
        });
      }
    }

    res.status(201).json({
      success: true,
      data: savedEmail,
      message: 'Email received and saved',
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
    const { page = 1, limit = 20, fraudulent } = req.query;
    const query = {};
    
    if (fraudulent !== undefined) {
      query.isFraudulent = fraudulent === 'true';
    }

    const emails = await Email.find(query)
      .sort({ receivedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Email.countDocuments(query);

    res.status(200).json({
      success: true,
      data: emails,
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
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found',
      });
    }
    res.status(200).json({
      success: true,
      data: email,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const email = await Email.findByIdAndDelete(req.params.id);
    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Email deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
