import  { prisma }  from '../lib/prisma/prisma';


export const entityMap: Record<string, any> = {
  addresses: prisma.addresses,
  locations: prisma.locations,
  soldier_status_history: prisma.soldier_status_history,
  soldiers: prisma.soldiers,
  tefillin: prisma.tefillin,
  users: prisma.users,
} as const;


const idTypeMap: Record<string, 'number' | 'string'> = {
  addresses: 'number',
  locations: 'string',
  soldier_status_history: 'string',
  soldiers: 'string',
  tefillin: 'string',
  users: 'string',
};

export function parseId(entity: string, id: string) {
  return idTypeMap[entity] === 'number' ? Number(id) : id;
}
