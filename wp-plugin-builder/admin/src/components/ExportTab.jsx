import React, { useState } from "react";

export default function ExportTab({ project }) {
  const [loading, setLoading] = useState(false);
  const [zipUrl, setZipUrl] = useState(null);
  const [zipPath, setZipPath] = useState(null);
  const [folderPath, setFolderPath] = useState(null);
  const [saveHistory, setSaveHistory] = useState(true);
  const [deleteAfter, setDeleteAfter] = useState(false);
  const [error, setError] = useState(null);

  async function handleExport() {
    setLoading(true);
    setError(null);
    setZipUrl(null);

    try {
      const endpoint = (window.wpb_rest && window.wpb_rest.root ? window.wpb_rest.root : '') + 'wpb/v1/export';
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": (window.wpb_rest && window.wpb_rest.nonce) || ""
        },
        body: JSON.stringify({
          project,
          files: project.files || {},
          save_project: saveHistory,
          delete_after: deleteAfter
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'خطأ في الخادم');
      }

      setZipUrl(data.zip_url);
      setZipPath(data.zip_path);
      setFolderPath(data.project_folder);

      // إذا حدد المستخدم الحذف الفوري بعد التحميل:
      if (deleteAfter) {
        // بعد تنزيل الملف سنرسل طلب حذف (يمكن عمله عبر زر أيضاً)
      }

    } catch (e) {
      console.error(e);
      setError(e.message || 'خطأ غير معروف');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!zipUrl) return;
    // فتح رابط التحميل
    window.open(zipUrl, "_blank");
  }

  async function handleDeleteSaved() {
    if (!zipPath && !folderPath) {
      alert("لا يوجد ما يحذف.");
      return;
    }

    if (!confirm("حذف المجلد و/أو الملف المضغوط؟")) return;

    const endpoint = (window.wpb_rest && window.wpb_rest.root ? window.wpb_rest.root : '') + 'wpb/v1/delete_export';
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": (window.wpb_rest && window.wpb_rest.nonce) || ""
      },
      body: JSON.stringify({
        zip_path: zipPath,
        project_folder: folderPath
      })
    });
    const data = await res.json();
    if (data.success) {
      alert("تم الحذف.");
      setZipUrl(null);
      setZipPath(null);
      setFolderPath(null);
    } else {
      alert("خطأ في الحذف.");
    }
  }

  return (
    <div>
      <p>تصدير البلجن كملف ZIP وإمكانية حفظ المشروع على السيرفر.</p>

      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:8}}>
        <label style={{display:'flex', gap:6, alignItems:'center'}}>
          <input type="checkbox" checked={saveHistory} onChange={(e)=>setSaveHistory(e.target.checked)} />
          حفظ المشروع في الخادم (تخزين التاريخ والملفات)
        </label>

        <label style={{display:'flex', gap:6, alignItems:'center', marginLeft:12}}>
          <input type="checkbox" checked={deleteAfter} onChange={(e)=>setDeleteAfter(e.target.checked)} />
          حذف تلقائي بعد التحميل
        </label>
      </div>

      <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
        <button onClick={handleExport} disabled={loading} style={{padding:'8px 12px'}}>
          {loading ? 'جارٍ التصدير...' : 'تصدير إلى ZIP (خادم)'}
        </button>
      </div>

      {error && <div style={{color:'red', marginTop:10}}>{error}</div>}

      {zipUrl && (
        <div style={{marginTop:12}}>
          <div>رابط التحميل: <a href={zipUrl} target="_blank" rel="noreferrer">{zipUrl}</a></div>
          <div style={{marginTop:8, display:'flex', gap:8}}>
            <button onClick={handleDownload} style={{padding:'8px 10px'}}>تحميل الآن</button>
            <button onClick={handleDeleteSaved} style={{padding:'8px 10px'}}>حذف من السيرفر</button>
          </div>
        </div>
      )}
    </div>
  );
}
