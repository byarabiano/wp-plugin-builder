import React from "react";

export default function Tabs({ tabs = [], active, onChange }) {
    return (
        <div className="wpb-tabs">
            {tabs.map((t) => (
                <div
                    key={t.id}
                    className={
                        "wpb-tab" + (active === t.id ? " wpb-tab-active" : "")
                    }
                    onClick={() => onChange(t.id)}
                >
                    {t.label}
                </div>
            ))}
        </div>
    );
}
