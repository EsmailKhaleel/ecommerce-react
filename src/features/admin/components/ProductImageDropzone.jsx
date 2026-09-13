import { useRef, useState } from 'react';
import { Box, Button, Chip, IconButton, Stack, Typography } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { toast } from 'react-toastify';

const accepted = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export default function ProductImageDropzone({ value, onChange, error, disabled }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const addFiles = fileList => {
    const files = Array.from(fileList || []);
    const valid = files.filter(file => {
      if (!accepted.has(file.type)) { toast.error(`${file.name}: choose JPG, PNG, WebP or GIF`); return false; }
      if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name}: maximum size is 10 MB`); return false; }
      return true;
    });
    onChange([...value, ...valid.map(file => ({ id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`, file, url: URL.createObjectURL(file) }))]);
  };

  const remove = index => {
    const item = value[index];
    if (item?.file && item.url) URL.revokeObjectURL(item.url);
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  };

  const makePrimary = index => onChange([value[index], ...value.filter((_, itemIndex) => itemIndex !== index)]);

  return <Stack spacing={1.5}>
    <Box
      role="button"
      tabIndex={0}
      aria-label="Upload product images"
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={event => { if (['Enter', ' '].includes(event.key)) { event.preventDefault(); inputRef.current?.click(); } }}
      onDragEnter={event => { event.preventDefault(); setDragging(true); }}
      onDragOver={event => event.preventDefault()}
      onDragLeave={event => { event.preventDefault(); if (event.currentTarget === event.target) setDragging(false); }}
      onDrop={event => { event.preventDefault(); setDragging(false); if (!disabled) addFiles(event.dataTransfer.files); }}
      sx={{ border: 2, borderStyle: 'dashed', borderColor: error ? 'error.main' : dragging ? 'primary.main' : 'divider', bgcolor: dragging ? 'action.hover' : 'transparent', borderRadius: 2, p: 3, textAlign: 'center', cursor: disabled ? 'default' : 'pointer', transition: '150ms' }}
    >
      <input ref={inputRef} hidden type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={event => { addFiles(event.target.files); event.target.value = ''; }} />
      <CloudUploadOutlinedIcon color="primary" sx={{ fontSize: 42 }} />
      <Typography fontWeight={800}>Drop product images here</Typography>
      <Typography variant="body2" color="text.secondary">or select JPG, PNG, WebP or GIF files · up to 10 MB each</Typography>
      <Button component="span" sx={{ mt: 1 }} disabled={disabled}>Choose files</Button>
    </Box>
    {error && <Typography color="error" variant="caption">{error}</Typography>}
    {value.length > 0 && <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 1.5 }}>
      {value.map((item, index) => <Box key={item.id} sx={{ position: 'relative', border: 1, borderColor: index === 0 ? 'primary.main' : 'divider', borderRadius: 2, overflow: 'hidden', bgcolor: 'action.hover' }}>
        <Box component="img" src={item.url} alt={`Product preview ${index + 1}`} sx={{ display: 'block', width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 0.5 }}>
          {index === 0 ? <Chip size="small" color="primary" label="Primary" /> : <IconButton size="small" title="Make primary" onClick={() => makePrimary(index)} disabled={disabled}><StarBorderIcon fontSize="small" /></IconButton>}
          <IconButton size="small" color="error" title="Remove image" onClick={() => remove(index)} disabled={disabled}><DeleteOutlineIcon fontSize="small" /></IconButton>
        </Stack>
      </Box>)}
    </Box>}
  </Stack>;
}
