// src/mocks/evidences.ts
import {Evidence} from '../types/evidence';

export const mockEvidences: Record<'left' | 'right', Evidence[]> = {
    "left": [
        {
            "id": 1,
            "title": "The certificate issued by the Jianshan Village Committee of Shuicheng County confirms: Mi 2 and Wang 3 held a wedding ceremony according to local customs on October 1, 1983, and had four children, proving that they were in a de facto marriage."
        },
        {
            "id": 2,
            "title": "The statement written by witness Huang confirms: Mi 2 and Wang 3 got married on October 1, 1983, and had four children after marriage."
        },
        {
            "id": 3,
            "title": "The statement written by witness Du confirms: Mi 2 and Wang 3 got married on October 1, 1983, and had four children."
        },
        {
            "id": 4,
            "title": "The testimony of witness Wang 1 (son of Wang 3) confirms: Mi 2 left home for a reason, which was to seek medical treatment for their child Wang 1 who was ill."
        },
        {
            "id": 5,
            "title": "The testimony of witness Wang 2 (daughter of Wang 3) confirms: Wang 3 had long-term domestic violence against Mi 2."
        }
    ],
    "right": [
        {
            "id": 1,
            "title": "The household register confirms: The situation of the children born to Wang 3, Mi 2, and Ao."
        },
        {
            "id": 2,
            "title": "The appraisal report confirms: Wang 1 and Wang 3 are father and son."
        },
        {
            "id": 3,
            "title": "The marriage registration certificate confirms: Wang 3 and Ao registered their marriage on July 28, 2016."
        },
        {
            "id": 4,
            "title": "The copy of Wang 3's family household register confirms: The qualification of the litigation subject and that Wang 3 still has two children, Wang 3 and Wang 4, to support."
        },
        {
            "id": 5,
            "title": "A statement issued by the Jianshan Sub-district Office of Shuicheng County. Confirms: Mi 2 left home on March 24, 2008, and has not returned since."
        },
        {
            "id": 6,
            "title": "The family household register of Wang 5 and a certificate from the Jianshan Village Committee of Shuicheng County. Confirms: Wang 3's father, Wang 5, has passed away, and his mother, Jin, requires Wang 3's support. His younger brother, Wang 6, who suffers from mental illness, also requires Wang 3's care."
        },
        {
            "id": 7,
            "title": "A disease certificate and medical records issued by the Liupanshui Shancheng Psychiatric Hospital, a disability certificate, and a civil mediation document from the Shuicheng County People's Court. Confirms: Wang 3's brother, Wang 6, was diagnosed with schizophrenia by the Liupanshui Shancheng Psychiatric Hospital and was identified as a disabled person with a second-level physical disability by the Shuicheng County Disabled Persons' Federation. He divorced his wife, Jin, on December 15, 2015, and their son, Wang 1, was to be raised by Wang 6. The defendant, Wang 3, is the sole supporter of his brother Wang 6."
        },
        {
            "id": 8,
            "title": "An interrogation record of Wang 3. Confirms: The defendant, Wang 3, admits to having a de facto marriage relationship with Mi 2 and the fact of registering a marriage with Ao."
        }
    ]
};