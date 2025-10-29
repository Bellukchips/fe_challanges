import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { JobSeeker } from "@/types/jobseeker.type";

const filePath = path.join(process.cwd(), 'public', 'data/dataCandidate.json');


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

        const { newCandidate, slug } = body;


        if (!slug || !newCandidate) {
            return NextResponse.json(
                { message: 'Slug and candidate data are required' },
                { status: 400 }
            );
        }

        let existing: { data: Record<string, JobSeeker[]> } = {
            data: {}
        };

        if (fs.existsSync(filePath)) {
            try {
                const raw = fs.readFileSync(filePath, "utf-8").trim();
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed && typeof parsed.data === "object" && !Array.isArray(parsed.data)) {
                        existing = parsed;
                    }
                }
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
            }
        }

        if (!existing.data[slug]) {
            existing.data[slug] = [];
        }


        if (!newCandidate.id) {
            newCandidate.id = `candidate_${slug}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        }

        existing.data[slug].push(newCandidate);


        fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), 'utf-8');

        return NextResponse.json({
            message: "Candidate added successfully",
            data: newCandidate
        });

    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json(
            { message: 'Error processing request', error: String(error) },
            { status: 500 }
        );
    }
}