export default function ProductTabs({ product }) {
  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
        <span style={{ fontFamily: 'Poppins', fontSize: '0.82rem', fontWeight: 700, color: '#16a34a' }}>
          Description
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <p style={{ fontFamily: 'Poppins', fontSize: '0.85rem', color: '#374151', lineHeight: 1.8, margin: 0 }}>
          {product.story || product.description || 'No description available.'}
        </p>
      </div>
    </div>
  );
}
