// src/api/evidenceApi.ts
import {Evidence} from '../types/evidence';
import {mockEvidences} from "../mock/evidences.ts";

const useMock = import.meta.env.VITE_USE_MOCK;

export async function fetchEvidences(side: 'left' | 'right'): Promise<Evidence[]> {
    console.log("mock evidences =", useMock);
    // 通过环境变量切换Mock
    if (useMock === 'true') {
        return mockEvidences[side];
    }

    const res = await fetch(`/api/evidences?side=${side}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${side} evidences`);
    }
    const data: Evidence[] = await res.json();
    return data;
}
