import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { materialValidationSchema } from 'validationSchema/materials';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getMaterials();
    case 'POST':
      return createMaterial();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getMaterials() {
    const data = await prisma.material
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'material'));
    return res.status(200).json(data);
  }

  async function createMaterial() {
    await materialValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.material.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
