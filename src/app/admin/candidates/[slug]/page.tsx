"use client";

import { Navbar } from "@/components/navbar";
import { ProtectedRoute } from "@/components/protected-route";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { slugToTitle } from "@/lib/helpers/generateSlug";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useJobSeekerStore } from "@/store/useJobSeekerStore";
import { JobSeeker } from "@/types/jobseeker.type";
import EmptyJobState from "@/components/state/empty-job-state";
import LoadingPage from "@/app/loading";
import { X } from "lucide-react";

interface Column {
    id: 'full_name' | 'email' | 'phone_number' | 'date_of_birth' | 'domicile' | 'gender' | 'linkedin_link';
    label: string;
    width: number;
}

export default function CandidatesList() {
    const { slug } = useParams<{ slug?: string }>();
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const { loadJobSeeker, jobSeeker, isLoading } = useJobSeekerStore();
    const [candidates, setCandidates] = useState<JobSeeker[]>([]);
    const [columns, setColumns] = useState<Column[]>([
        { id: 'full_name', label: 'NAMA LENGKAP', width: 200 },
        { id: 'email', label: 'EMAIL ADDRESS', width: 200 },
        { id: 'phone_number', label: 'PHONE NUMBERS', width: 150 },
        { id: 'date_of_birth', label: 'DATE OF BIRTH', width: 150 },
        { id: 'domicile', label: 'DOMICILE', width: 150 },
        { id: 'gender', label: 'GENDER', width: 100 },
        { id: 'linkedin_link', label: 'LINK LINKEDIN', width: 250 }
    ]);
    const [draggedColumn, setDraggedColumn] = useState<number | null>(null);
    const [resizingColumn, setResizingColumn] = useState<number | null>(null);
    const [startX, setStartX] = useState<number>(0);
    const [startWidth, setStartWidth] = useState<number>(0);

    useEffect(() => {
        loadJobSeeker(slug ?? "");
    }, [loadJobSeeker, slug]);

    useEffect(() => {
        setCandidates(jobSeeker);
    }, [jobSeeker]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent): void => {
            if (resizingColumn === null) return;

            const diff = e.clientX - startX;
            const newWidth = Math.max(100, startWidth + diff);

            setColumns(prev => prev.map((col, idx) =>
                idx === resizingColumn ? { ...col, width: newWidth } : col
            ));
        };

        const handleMouseUp = (): void => {
            setResizingColumn(null);
        };

        if (resizingColumn !== null) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [resizingColumn, startX, startWidth]);

    const handleDragStart = (e: React.DragEvent<HTMLTableCellElement>, index: number): void => {
        setDraggedColumn(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLTableCellElement>): void => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLTableCellElement>, dropIndex: number): void => {
        e.preventDefault();
        if (draggedColumn === null || draggedColumn === dropIndex) return;

        const newColumns = [...columns];
        const [removed] = newColumns.splice(draggedColumn, 1);
        newColumns.splice(dropIndex, 0, removed);

        setColumns(newColumns);
        setDraggedColumn(null);
    };

    const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>, index: number): void => {
        e.preventDefault();
        e.stopPropagation();
        setResizingColumn(index);
        setStartX(e.clientX);
        setStartWidth(columns[index].width);
    };

    const toggleRow = (id: string) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const toggleAll = () => {
        if (selectedRows.length === candidates.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(candidates.map(user => user.id));
        }
    };

    const getCellValue = (user: JobSeeker, columnId: Column['id']): React.ReactNode => {
        if (columnId === 'date_of_birth') {
            return user.date_of_birth ?? <X className="w-4 h-4 text-gray-400" />;
        }

        if (columnId === 'linkedin_link') {
            return (
                <a
                    href={user.linkedin_link}
                    className="text-blue-500 hover:text-blue-700 hover:underline truncate block"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {user.linkedin_link}
                </a>
            );
        }


        return user[columnId];
    };

    let content;
    if (isLoading) {
        content = <LoadingPage />;
    } else if (candidates.length === 0) {
        content = (
            <div className="flex flex-col items-center justify-center mt-50">
                <EmptyJobState
                    img="/empty-candidate.png"
                    title="No candidate found"
                    subtitle="Share your job vacancies so that more candidates will apply."
                />
            </div>
        );
    } else {
        content = (
            <Card className="mt-10">
                <CardContent className="px-5">
                    <div className="rounded-md border overflow-x-auto">
                        <Table>
                            <TableHeader className="h-15">
                                <TableRow className="bg-gray-50">
                                    <TableHead className="w-12 border-r border-gray-200">
                                        <Checkbox
                                            className="border border-[#01959F]"
                                            checked={selectedRows.length === candidates.length && candidates.length > 0}
                                            onCheckedChange={toggleAll}
                                        />
                                    </TableHead>
                                    {columns.map((column, index) => (
                                        <TableHead
                                            key={column.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, index)}
                                            className="font-semibold text-gray-700 relative cursor-move select-none border-r border-gray-200 last:border-r-0"
                                            style={{ width: column.width, minWidth: column.width }}
                                        >
                                            <div className="flex items-center justify-between pr-2">
                                                <span>{column.label}</span>
                                                <div
                                                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 transition-colors z-10"
                                                    onMouseDown={(e) => handleResizeStart(e, index)}
                                                />
                                            </div>
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {candidates.map((user) => (
                                    <TableRow key={user.id} className="hover:bg-gray-50">
                                        <TableCell className="border-r border-gray-200">
                                            <Checkbox
                                                className="border border-[#01959F]"
                                                checked={selectedRows.includes(user.id)}
                                                onCheckedChange={() => toggleRow(user.id)}
                                            />
                                        </TableCell>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                className={`${column.id === 'full_name' ? 'font-medium' : 'text-gray-600'} border-r border-gray-200 last:border-r-0`}
                                                style={{ width: column.width, minWidth: column.width }}
                                            >
                                                {getCellValue(user, column.id)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <div className="min-h-screen flex flex-col overflow-y-auto">
                <Navbar />
                <div className="py-10 px-10">
                    <h1 className="font-bold text-2xl">{slugToTitle(slug ?? '')}</h1>
                    {content}
                </div>
            </div>
        </ProtectedRoute>
    );
}