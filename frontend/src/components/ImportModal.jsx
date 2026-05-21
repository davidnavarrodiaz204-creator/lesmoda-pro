import { useState, useRef } from 'react';
import { productService } from '../services/api';
import toast from 'react-hot-toast';
import { CloseIcon } from './Icons';

const TEMPLATE_HEADERS = ['name','category','price','oldPrice','stock','badge','sizes','colors','description','imageUrl','isActive','featured'];

function downloadTemplate() {
  const header = TEMPLATE_HEADERS.join(',');
  const example = ['Blusa cruzada','Mujer','16','20','5','sale','S|M|L','Negro|Blanco','Blusa elegante para dama','https://ejemplo.com/imagen.jpg','true','false'];
  const csv = header + '\n' + example.join(',');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'plantilla_productos.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function ImportModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.name.toLowerCase().endsWith('.csv')) {
      setError('Solo se aceptan archivos CSV');
      return;
    }
    setFile(f);
    setError('');
    setPreview(null);
    setResult(null);
  };

  const handlePreview = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await productService.importPreview(file);
      if (data.success) {
        setPreview(data.data);
      } else {
        setError(data.message || 'Error al procesar archivo');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al leer el archivo');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!preview || preview.valid.length === 0) return;
    setImporting(true);
    setError('');
    try {
      const { data } = await productService.importConfirm(preview.valid);
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Error al importar');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al importar productos');
    } finally {
      setImporting(false);
    }
  };

  const hasFile = !!file;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div style={{
        background:'var(--lm-surface)', borderRadius:16, width:'100%', maxWidth:680,
        maxHeight:'92vh', overflowY:'auto', position:'relative',
        boxShadow:'0 24px 80px rgba(0,0,0,0.3)', animation:'modalFadeIn .35s ease-out',
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          padding:'1.25rem 1.5rem 0.75rem', borderBottom:'1px solid var(--lm-border)',
          display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0,
          background:'var(--lm-surface)', zIndex:10, borderRadius:'16px 16px 0 0',
        }}>
          <h2 style={{fontFamily:'var(--lm-font-heading, serif)',fontSize:'1.15rem',color:'var(--lm-text)'}}>Importar productos</h2>
          <button onClick={onClose} style={{
            background:'none', border:'none', cursor:'pointer', color:'var(--lm-muted)',
            display:'flex', alignItems:'center', justifyContent:'center', padding:'0.25rem',
          }}><CloseIcon size={18} /></button>
        </div>

        <div style={{padding:'1.25rem 1.5rem', display:'flex', flexDirection:'column', gap:'1rem'}}>
          {/* Template download */}
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem'}}>
            <div>
              <div style={{fontSize:'0.88rem',fontWeight:600,color:'var(--lm-text)'}}>Formato esperado</div>
              <div style={{fontSize:'0.78rem',color:'var(--lm-muted)',marginTop:'0.2rem'}}>
                Columnas: name, category, price, oldPrice, stock, badge, sizes, colors, description, imageUrl, isActive, featured
              </div>
            </div>
            <button onClick={downloadTemplate} style={{
              display:'inline-flex', alignItems:'center', gap:'0.4rem',
              padding:'0.5rem 1rem', borderRadius:8, border:'1.5px solid var(--lm-primary)',
              background:'transparent', color:'var(--lm-primary)', fontWeight:600, fontSize:'0.82rem',
              cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Descargar plantilla
            </button>
          </div>

          {/* File upload */}
          <div style={{
            border:'2px dashed', borderColor: error ? 'var(--lm-danger)' : 'var(--lm-border)',
            borderRadius:12, padding:'2rem 1.5rem', textAlign:'center',
            background: hasFile ? 'var(--lm-bg)' : 'var(--lm-bg)', transition:'all .2s', cursor:'pointer',
          }} onClick={() => fileRef.current?.click()}>
            <input type="file" ref={fileRef} accept=".csv" onChange={handleFile} style={{display:'none'}} />
            {hasFile ? (
              <div>
                <div style={{fontSize:'0.9rem',fontWeight:600,color:'var(--lm-text)',marginBottom:'0.25rem'}}>{file.name}</div>
                <div style={{fontSize:'0.78rem',color:'var(--lm-muted)'}}>{(file.size / 1024).toFixed(1)} KB</div>
                <div style={{marginTop:'0.5rem'}}>
                  <span style={{fontSize:'0.75rem',color:'var(--lm-primary)',fontWeight:600,cursor:'pointer'}}>Cambiar archivo</span>
                </div>
              </div>
            ) : (
              <div>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--lm-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{marginBottom:'0.5rem',opacity:0.5}}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <div style={{fontSize:'0.88rem',fontWeight:600,color:'var(--lm-text)'}}>Subir archivo CSV</div>
                <div style={{fontSize:'0.78rem',color:'var(--lm-muted)',marginTop:'0.2rem'}}>Maximo 300 filas, 2 MB</div>
              </div>
            )}
          </div>

          {error && (
            <div style={{
              padding:'0.65rem 0.85rem', borderRadius:8, fontSize:'0.82rem',
              background:'rgba(var(--lm-danger-rgb, 239,68,68),0.08)', border:'1px solid rgba(var(--lm-danger-rgb, 239,68,68),0.2)', color:'var(--lm-danger)',
            }}>{error}</div>
          )}

          {/* Preview button */}
          {hasFile && !preview && !result && (
            <button onClick={handlePreview} disabled={loading} style={{
              display:'inline-flex',alignItems:'center',gap:'0.4rem',
              padding:'0.6rem 1.3rem', borderRadius:8, border:'none',
              background:'var(--lm-secondary)', color:'var(--lm-primary)', fontWeight:600, fontSize:'0.85rem',
              cursor:'pointer', fontFamily:'inherit', width:'fit-content',
            }}>
              {loading ? 'Procesando...' : 'Vista previa'}
            </button>
          )}

          {/* Preview table */}
          {preview && !result && (
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div style={{
                display:'flex', gap:'0.75rem', flexWrap:'wrap',
                padding:'0.75rem 1rem', borderRadius:8, background:'var(--lm-bg)',
              }}>
                <span style={{fontSize:'0.82rem',color:'var(--lm-text)',fontWeight:500}}>Total: {preview.total} filas</span>
                <span style={{fontSize:'0.82rem',color:'var(--lm-success)',fontWeight:600}}>Validas: {preview.validCount}</span>
                {preview.invalidCount > 0 && (
                  <span style={{fontSize:'0.82rem',color:'var(--lm-danger)',fontWeight:600}}>Con errores: {preview.invalidCount}</span>
                )}
              </div>

              {preview.valid.length > 0 && (
                <div>
                  <div style={{fontSize:'0.8rem',fontWeight:600,color:'var(--lm-text)',marginBottom:'0.5rem'}}>
                    Productos a importar ({preview.valid.length})
                  </div>
                  <div style={{overflowX:'auto',border:'1px solid var(--lm-border)',borderRadius:8}}>
                    <table style={{width:'100%',borderCollapse:'collapse',fontSize:'0.78rem'}}>
                      <thead>
                        <tr style={{background:'var(--lm-bg)'}}>
                          <th style={{padding:'0.4rem 0.6rem',textAlign:'left',color:'var(--lm-muted)',fontWeight:600,whiteSpace:'nowrap'}}>Nombre</th>
                          <th style={{padding:'0.4rem 0.6rem',textAlign:'left',color:'var(--lm-muted)',fontWeight:600,whiteSpace:'nowrap'}}>Cat.</th>
                          <th style={{padding:'0.4rem 0.6rem',textAlign:'right',color:'var(--lm-muted)',fontWeight:600,whiteSpace:'nowrap'}}>Precio</th>
                          <th style={{padding:'0.4rem 0.6rem',textAlign:'center',color:'var(--lm-muted)',fontWeight:600,whiteSpace:'nowrap'}}>Stock</th>
                          <th style={{padding:'0.4rem 0.6rem',textAlign:'center',color:'var(--lm-muted)',fontWeight:600,whiteSpace:'nowrap'}}>Badge</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.valid.map((row, i) => (
                          <tr key={i} style={{borderBottom:'1px solid var(--lm-border)'}}>
                            <td style={{padding:'0.35rem 0.6rem',color:'var(--lm-text)',fontWeight:500}}>{row.name}</td>
                            <td style={{padding:'0.35rem 0.6rem',color:'var(--lm-muted)'}}>{row.category}</td>
                            <td style={{padding:'0.35rem 0.6rem',textAlign:'right',color:'var(--lm-text)',fontWeight:500}}>S/ {row.price.toFixed(2)}</td>
                            <td style={{padding:'0.35rem 0.6rem',textAlign:'center',color:'var(--lm-text)'}}>{row.stock}</td>
                            <td style={{padding:'0.35rem 0.6rem',textAlign:'center'}}>
                              {row.badge ? <span style={{fontSize:'0.6rem',fontWeight:700,textTransform:'uppercase',background:'var(--lm-primary)',color:'white',padding:'0.1rem 0.4rem',borderRadius:3}}>{row.badge}</span> : <span style={{color:'var(--lm-muted)'}}>---</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {preview.invalid.length > 0 && (
                <div>
                  <div style={{fontSize:'0.8rem',fontWeight:600,color:'var(--lm-danger)',marginBottom:'0.5rem'}}>
                    Filas con errores ({preview.invalid.length})
                  </div>
                  <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                    {preview.invalid.map((row, i) => (
                      <div key={i} style={{
                        padding:'0.5rem 0.75rem', borderRadius:6, background:'rgba(var(--lm-danger-rgb, 239,68,68),0.08)',
                        border:'1px solid rgba(var(--lm-danger-rgb, 239,68,68),0.2)', fontSize:'0.78rem',
                      }}>
                        <div style={{fontWeight:600,color:'var(--lm-danger)'}}>Fila {row.index + 2}</div>
                        {row.errors.map((err, j) => (
                          <div key={j} style={{color:'var(--lm-muted)',marginTop:'0.15rem'}}>{err}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {preview.valid.length > 0 && (
                <button onClick={handleConfirm} disabled={importing} style={{
                  display:'inline-flex',alignItems:'center',gap:'0.4rem',
                  padding:'0.65rem 1.5rem', borderRadius:8, border:'none',
                  background:'var(--lm-success)', color:'white', fontWeight:600, fontSize:'0.88rem',
                  cursor:'pointer', fontFamily:'inherit', width:'fit-content',
                  opacity: importing ? 0.6 : 1,
                }}>
                  {importing ? 'Importando...' : `Importar ${preview.valid.length} producto(s)`}
                </button>
              )}
            </div>
          )}

          {/* Result */}
          {result && (
            <div style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
              <div style={{
                padding:'1rem', borderRadius:8,
                background: result.created > 0 ? 'rgba(var(--lm-success-rgb, 34,197,94),0.1)' : 'rgba(var(--lm-danger-rgb, 239,68,68),0.08)',
                color: result.created > 0 ? 'var(--lm-success)' : 'var(--lm-danger)', fontSize:'0.9rem', fontWeight:600,
              }}>
                {result.created > 0
                  ? `Importacion completada: ${result.created} producto(s) creado(s)`
                  : 'No se crearon productos'}
              </div>
              <div style={{display:'flex',gap:'0.75rem',flexWrap:'wrap',fontSize:'0.82rem'}}>
                <span style={{color:'var(--lm-success)',fontWeight:600}}>Creados: {result.created}</span>
                {result.skipped > 0 && <span style={{color:'#B8941E',fontWeight:600}}>Saltados: {result.skipped}</span>}
                {result.errors > 0 && <span style={{color:'var(--lm-danger)',fontWeight:600}}>Errores: {result.errors}</span>}
              </div>
              {result.skippedDetails?.length > 0 && (
                <div>
                  <div style={{fontSize:'0.8rem',fontWeight:600,color:'#B8941E',marginBottom:'0.4rem'}}>Saltados:</div>
                  {result.skippedDetails.map((s, i) => (
                    <div key={i} style={{fontSize:'0.78rem',color:'var(--lm-muted)',padding:'0.2rem 0'}}>
                      {s.name}: {s.reason}
                    </div>
                  ))}
                </div>
              )}
              <div style={{display:'flex',gap:'0.5rem',marginTop:'0.5rem'}}>
                <button onClick={onClose} style={{
                  padding:'0.55rem 1.25rem', borderRadius:8, border:'1.5px solid var(--lm-border)',
                  background:'transparent', color:'var(--lm-muted)', fontWeight:500, fontSize:'0.85rem',
                  cursor:'pointer', fontFamily:'inherit',
                }}>Cerrar</button>
                <button onClick={() => { setFile(null); setPreview(null); setResult(null); setError(''); }} style={{
                  padding:'0.55rem 1.25rem', borderRadius:8, border:'none',
                  background:'var(--lm-secondary)', color:'var(--lm-primary)', fontWeight:600, fontSize:'0.85rem',
                  cursor:'pointer', fontFamily:'inherit',
                }}>Importar otro archivo</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}