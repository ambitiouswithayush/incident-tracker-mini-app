require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

const app = express();

// Create Prisma adapter with URL
const dbPath = path.resolve(__dirname, 'prisma/dev.db');
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });

// Create Prisma client with adapter
const prisma = new PrismaClient({ adapter });

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Validation helper
const validateIncident = (data) => {
  const errors = [];
  if (!data.title || data.title.trim() === '') {
    errors.push('Title is required');
  }
  if (!data.service || data.service.trim() === '') {
    errors.push('Service is required');
  }
  if (!data.severity) {
    errors.push('Severity is required');
  }
  if (!data.status) {
    errors.push('Status is required');
  }

  // Validate enum values
  const validSeverities = ['SEV1', 'SEV2', 'SEV3', 'SEV4'];
  if (data.severity && !validSeverities.includes(data.severity)) {
    errors.push('Severity must be one of: SEV1, SEV2, SEV3, SEV4');
  }

  const validStatuses = ['OPEN', 'MITIGATED', 'RESOLVED'];
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push('Status must be one of: OPEN, MITIGATED, RESOLVED');
  }

  return errors;
};

// A. POST /api/incidents - Create a new incident
app.post('/api/incidents', async (req, res) => {
  try {
    const { title, service, severity, status, owner, summary } = req.body;

    // Validate required fields
    const errors = validateIncident({ title, service, severity, status });
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') });
    }

    const incident = await prisma.incident.create({
      data: {
        title: title.trim(),
        service: service.trim(),
        severity,
        status,
        owner: owner ? owner.trim() : null,
        summary: summary ? summary.trim() : null,
      },
    });

    res.status(201).json(incident);
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ error: 'Failed to create incident' });
  }
});

// B. GET /api/incidents - Get all incidents with pagination, search, filters, sorting
app.get('/api/incidents', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      severity,
      status,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where = {};

    // Search in title and service
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { service: { contains: search } },
      ];
    }

    // Filter by severity
    if (severity) {
      where.severity = severity;
    }

    // Filter by status
    if (status) {
      where.status = status;
    }

    // Valid sort fields
    const validSortFields = ['createdAt', 'severity', 'title'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order.toLowerCase() === 'asc' ? 'asc' : 'desc';

    // Get total count
    const total = await prisma.incident.count({ where });

    // Get paginated incidents
    const incidents = await prisma.incident.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: {
        [sortField]: sortOrder,
      },
    });

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      data: incidents,
      total,
      page: pageNum,
      pages: totalPages,
    });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

// C. GET /api/incidents/:id - Fetch single incident by ID
app.get('/api/incidents/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await prisma.incident.findUnique({
      where: { id },
    });

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json(incident);
  } catch (error) {
    console.error('Error fetching incident:', error);
    res.status(500).json({ error: 'Failed to fetch incident' });
  }
});

// D. PATCH /api/incidents/:id - Update incident fields
app.patch('/api/incidents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, owner, summary } = req.body;

    // Check if incident exists
    const existingIncident = await prisma.incident.findUnique({
      where: { id },
    });

    if (!existingIncident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['OPEN', 'MITIGATED', 'RESOLVED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Status must be one of: OPEN, MITIGATED, RESOLVED' });
      }
    }

    // Update only provided fields
    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (owner !== undefined) updateData.owner = owner ? owner.trim() : null;
    if (summary !== undefined) updateData.summary = summary ? summary.trim() : null;

    const updatedIncident = await prisma.incident.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedIncident);
  } catch (error) {
    console.error('Error updating incident:', error);
    res.status(500).json({ error: 'Failed to update incident' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

