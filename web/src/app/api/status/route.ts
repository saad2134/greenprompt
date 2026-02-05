import { NextResponse } from 'next/server';

export const runtime = 'edge';

interface Service {
  name: string;
  check: () => Promise<boolean>;
}

const services: Service[] = [
  {
    name: 'Frontend Web (Vercel)',
    check: async () => {
      try {
        const res = await fetch('https://vercel.com', { method: 'HEAD', signal: AbortSignal.timeout(8000) });
        return res.status < 500;
      } catch {
        return false;
      }
    },
  },
  {
    name: 'Public APIs (Access Opens Soon)',
    check: async () => {
      try {
        const res = await fetch('https://x.com', { method: 'HEAD', signal: AbortSignal.timeout(8000) });
        return res.status < 500;
      } catch {
        return false;
      }
    },
  },
  {
    name: 'Core Service (Docker Instance)',
    check: async () => {
      try {
        const res = await fetch(`${process.env.BACKEND_CORE_SERVICE_BASE_URL || 'http://localhost:8000/'}health`, { method: 'HEAD', signal: AbortSignal.timeout(8000) });
        return res.status < 500;
      } catch {
        return false;
      }
    },
  },
  {
    name: 'Feedback Collection (Apps Script)',
    check: async () => {
      try {
        const res = await fetch('https://script.google.com/macros/s/AKfycbzxm5TmObKpnsht5_AtI4D-9gBbLUahnbiFGHxXjTM-xIRlNeKihnwbFoCHxyiz9rPI/exec', { method: 'HEAD', signal: AbortSignal.timeout(8000) });
        return res.status < 500;
      } catch {
        return false;
      }
    },
  },
];

export async function GET() {
  const results = await Promise.all(
    services.map(async (service) => {
      const status = await service.check();
      return {
        name: service.name,
        status,
        timestamp: new Date().toISOString(),
      };
    })
  );

  const allOperational = results.every((result) => result.status);

  return NextResponse.json({
    status: allOperational ? 'operational' : 'degraded',
    services: results,
    checkedAt: new Date().toISOString(),
  });
}
