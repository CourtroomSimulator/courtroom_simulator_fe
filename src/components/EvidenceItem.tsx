// EvidenceItem.tsx
import React from 'react';
import './EvidenceItem.css'; // 稍后我们会创建对应的css

interface EvidenceItemProps {
    text?: string;      // 证据标题文本
    backgroundColor?: string;  // 可以传入不同的颜色
}

const EvidenceItem: React.FC<EvidenceItemProps> = ({text = '证据', backgroundColor = '#6666ff'}) => {
    return (
        <div className="evidence-item" style={{ backgroundColor }}>
            {text}
        </div>
    );
};

export default EvidenceItem;
