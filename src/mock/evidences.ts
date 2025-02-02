// src/mocks/evidences.ts
import {Evidence} from '../types/evidence';

export const mockEvidences: Record<'left' | 'right', Evidence[]> = {
    left: [
        {id: 1, title: '左侧证据1'},
        {id: 2, title: '左侧证据2'}
    ],
    right: [
        {id: 3, title: '右侧证据1'},
        {id: 4, title: '右侧证据2'}
    ]
};