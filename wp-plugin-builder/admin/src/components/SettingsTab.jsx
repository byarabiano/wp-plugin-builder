import React, { useState } from "react";
import "./../styles/editor.css";

/* -----------------------------------------
   إعدادات المشروع — نسخة احترافية بداخلها Tabs
------------------------------------------- */

export default function SettingsTab({ project, setProject }) {
    const [activeTab, setActiveTab] = useState("general");

    const updateField = (key, value) => {
        setProject((prev) => ({
            ...prev,
            info: {
                ...prev.info,
                [key]: value,
            },
        }));
    };

    return (
        <div className="wpb-settings-wrapper">

            {/* --------- Tabs --------- */}
            <div className="wpb-settings-tabs">
                <div
                    className={`wpb-settings-tab-item ${activeTab === "general" ? "active" : ""}`}
                    onClick={() => setActiveTab("general")}
                >
                    ⚙ عام
                </div>

                <div
                    className={`wpb-settings-tab-item ${activeTab === "plugin" ? "active" : ""}`}
                    onClick={() => setActiveTab("plugin")}
                >
                    📦 معلومات الإضافة
                </div>

                <div
                    className={`wpb-settings-tab-item ${activeTab === "author" ? "active" : ""}`}
                    onClick={() => setActiveTab("author")}
                >
                    👤 الكاتب
                </div>

                <div
                    className={`wpb-settings-tab-item ${activeTab === "advanced" ? "active" : ""}`}
                    onClick={() => setActiveTab("advanced")}
                >
                    🛠 متقدم
                </div>
            </div>

            {/* --------- Content --------- */}
            <div className="wpb-settings-content">

                {/* --------- General Tab --------- */}
                {activeTab === "general" && (
                    <div className="wpb-settings-section">
                        <h2>⚙ الإعدادات العامة</h2>

                        <div className="wpb-settings-grid">

                            <div className="wpb-field">
                                <label>اسم المشروع</label>
                                <input
                                    type="text"
                                    value={project.info?.name || ""}
                                    onChange={(e) => updateField("name", e.target.value)}
                                />
                            </div>

                            <div className="wpb-field">
                                <label>Slug</label>
                                <input
                                    type="text"
                                    value={project.info?.slug || ""}
                                    onChange={(e) => updateField("slug", e.target.value)}
                                />
                            </div>

                        </div>
                    </div>
                )}

                {/* --------- Plugin Info --------- */}
                {activeTab === "plugin" && (
                    <div className="wpb-settings-section">
                        <h2>📦 معلومات الإضافة</h2>

                        <div className="wpb-settings-grid">

                            <div className="wpb-field">
                                <label>الإصدار (Version)</label>
                                <input
                                    type="text"
                                    value={project.info?.version || "1.0.0"}
                                    onChange={(e) => updateField("version", e.target.value)}
                                />
                            </div>

                            <div className="wpb-field">
                                <label>الوصف</label>
                                <textarea
                                    value={project.info?.description || ""}
                                    onChange={(e) => updateField("description", e.target.value)}
                                />
                            </div>

                        </div>
                    </div>
                )}

                {/* --------- Author Tab --------- */}
                {activeTab === "author" && (
                    <div className="wpb-settings-section">
                        <h2>👤 معلومات الكاتب</h2>

                        <div className="wpb-settings-grid">

                            <div className="wpb-field">
                                <label>الكاتب</label>
                                <input
                                    type="text"
                                    value={project.info?.author || ""}
                                    onChange={(e) => updateField("author", e.target.value)}
                                />
                            </div>

                            <div className="wpb-field">
                                <label>البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    value={project.info?.email || ""}
                                    onChange={(e) => updateField("email", e.target.value)}
                                />
                            </div>

                        </div>
                    </div>
                )}

                {/* --------- Advanced Tab --------- */}
                {activeTab === "advanced" && (
                    <div className="wpb-settings-section">
                        <h2>🛠 إعدادات متقدمة</h2>

                        <div className="wpb-settings-grid">

                            <div className="wpb-field">
                                <label>Text Domain</label>
                                <input
                                    type="text"
                                    value={project.info?.textdomain || ""}
                                    onChange={(e) => updateField("textdomain", e.target.value)}
                                />
                            </div>

                            <div className="wpb-field">
                                <label>Namespace (ملفات PHP)</label>
                                <input
                                    type="text"
                                    value={project.info?.namespace || ""}
                                    onChange={(e) => updateField("namespace", e.target.value)}
                                />
                            </div>

                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
