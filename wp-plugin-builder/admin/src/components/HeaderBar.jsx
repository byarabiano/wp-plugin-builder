import React from 'react'

export default function HeaderBar({ onOpenNew, onSearch, searchValue, setSearchValue }) {
  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <div style={styles.logo}>🔧</div>
        <div>
          <div style={styles.title}>WP Plugin Builder Studio</div>
          <div style={styles.subtitle}>بناء إضافات ووردبريس بسرعة وسهولة</div>
        </div>
      </div>

      <div style={styles.actions}>
        <input
          aria-label="ابحث"
          placeholder="ابحث عن مشروع..."
          value={searchValue}
          onChange={e => {
            setSearchValue(e.target.value)
            if (onSearch) onSearch(e.target.value)
          }}
          style={styles.search}
        />

        <button onClick={onOpenNew} style={styles.newBtn}>+ مشروع جديد</button>
      </div>
    </header>
  )
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    gap: 12,
  },
  brand: { display: 'flex', gap: 12, alignItems: 'center' },
  logo: { fontSize: 28, width: 48, height: 48, display:'flex', alignItems:'center', justifyContent:'center', background:'#fff', borderRadius:8, boxShadow:'0 1px 3px rgba(0,0,0,0.06)' },
  title: { fontSize: 18, fontWeight: 700 },
  subtitle: { fontSize: 12, color: '#666' },
  actions: { display: 'flex', gap: 8, alignItems: 'center' },
  search: { padding: '8px 10px', minWidth: 260, borderRadius: 6, border: '1px solid #e3e3e3' },
  newBtn: { background:'#0073aa', color:'#fff', border:'none', padding:'8px 12px', borderRadius:6, cursor:'pointer' }
}
