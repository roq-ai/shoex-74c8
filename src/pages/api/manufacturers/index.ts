import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { manufacturerValidationSchema } from 'validationSchema/manufacturers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getManufacturers();
    case 'POST':
      return createManufacturer();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getManufacturers() {
    const data = await prisma.manufacturer
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'manufacturer'));
    return res.status(200).json(data);
  }

  async function createManufacturer() {
    await manufacturerValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.quality_control?.length > 0) {
      const create_quality_control = body.quality_control;
      body.quality_control = {
        create: create_quality_control,
      };
    } else {
      delete body.quality_control;
    }
    const data = await prisma.manufacturer.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
