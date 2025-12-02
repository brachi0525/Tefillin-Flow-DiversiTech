
import { NextRequest, NextResponse } from 'next/server';
import  { prisma }  from '../lib/prisma/prisma';
import { entityMap, parseId } from './entityMap';

const error = (msg: string, status = 400) =>
  NextResponse.json({ error: msg }, { status });


export async function GET(req: NextRequest) {
  
  const { searchParams } = new URL(req.url);
  const entity = searchParams.get('entity');
  const id = searchParams.get('id');

  if (!entity || !(entity in entityMap)) {
    return error(`Invalid entity: ${entity}`);
  }

  const model = entityMap[entity as keyof typeof entityMap];
  
  if (id) {    
    const parsedId = parseId(entity, id);
    const item = await model.findUnique({ where: { id: parsedId } });
    
    return NextResponse.json(item);
  } else {
    const list = await model.findMany();
    return NextResponse.json(list);
  }
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const entity = searchParams.get('entity');

    if (!entity || !(entity in entityMap)) {
    return error(`Invalid entity: ${entity}`);
  }

  const model = entityMap[entity as keyof typeof entityMap];

  const body = await req.json();
  const created = await model.create({ data: body });
  return NextResponse.json(created, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const entity = searchParams.get('entity');
  const id = searchParams.get('id');
  
  if (!entity || !(entity in entityMap)) {
    return error(`Invalid entity: ${entity}`);
  }
   if (!id) {
    return error('Missing id for update');
  }

  const model = entityMap[entity as keyof typeof entityMap];
  const parsedId = parseId(entity, id);


  const body = await req.json();
  const updated = await model.update({
    where: { id: parsedId },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const entity = searchParams.get('entity');
  const id = searchParams.get('id');
  if (!entity || !(entity in entityMap)) {
    return error(`Invalid entity: ${entity}`);
  }
  if (!id) {
    return error('Missing id for delete');
  }


  const model = entityMap[entity as keyof typeof entityMap];
  const parsedId = parseId(entity, id);

  const deleted = await model.delete({
    where: { id: parsedId },
  });

  return NextResponse.json(deleted);
}