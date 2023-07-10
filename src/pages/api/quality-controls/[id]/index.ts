import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { qualityControlValidationSchema } from 'validationSchema/quality-controls';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.quality_control
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getQualityControlById();
    case 'PUT':
      return updateQualityControlById();
    case 'DELETE':
      return deleteQualityControlById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getQualityControlById() {
    const data = await prisma.quality_control.findFirst(convertQueryToPrismaUtil(req.query, 'quality_control'));
    return res.status(200).json(data);
  }

  async function updateQualityControlById() {
    await qualityControlValidationSchema.validate(req.body);
    const data = await prisma.quality_control.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteQualityControlById() {
    const data = await prisma.quality_control.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
