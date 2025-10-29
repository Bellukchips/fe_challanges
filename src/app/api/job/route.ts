import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { Job } from "@/types/job.types";

const filePath = path.join(process.cwd(), 'public', 'data/dataJobs.json');


function ensureDataDir() {
    const dataDir = path.dirname(filePath);
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
}


export async function GET() {
    try {
        ensureDataDir();

        const data = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(data);

        return NextResponse.json(parsed);

    } catch (error) {
        console.error('Error reading JSON file:', error);
        return NextResponse.error();
    }
}


export async function POST(request: NextRequest) {
    try {
        ensureDataDir();
        const body = await request.json();

        const newJob: Job = {
            id: "job_" + Math.floor(Math.random() * 10000),
            slug: body.slug + "_" + Math.floor(Math.random() * 10000),
            title: body.title,
            status: body.status,
            description: body.description,
            salary_range: body.salary_range,
            list_card: body.list_card,
            profile_requirements: body.profile_requirements
        };

        let existing: { data: Job[] } = { data: [] };

        if (fs.existsSync(filePath)) {
            try {
                const raw = fs.readFileSync(filePath, "utf-8").trim();
                if (raw) {
                    const parsed = JSON.parse(raw);

                    if (Array.isArray(parsed.data)) {
                        existing = parsed;
                    }
                }
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
            }
        }

        existing.data.unshift(newJob);
        if (existing.data.length > 100) {
            existing.data = existing.data.slice(0, 100);
        }

        fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

        return NextResponse.json({
            message: "Job berhasil disimpan",
            success: true
        });
    } catch (error) {
        console.error('Error in POST /api/wishes:', error);
        return NextResponse.json(
            { message: 'Gagal menyimpan Job' },
            { status: 500 }
        );
    }

}