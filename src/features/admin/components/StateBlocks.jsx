import { Box, Typography, Button, Alert, AlertTitle, CircularProgress } from '@mui/material';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';

/** Shown when a request fails. Surfaces the server message and offers a retry. */
export function ErrorState({ error, onRetry, title = 'Something went wrong' }) {
  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={onRetry}>
            Retry
          </Button>
        )
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {error?.message || 'Unexpected error. Please try again.'}
    </Alert>
  );
}

/** Shown when a request succeeds but there is genuinely nothing to display. */
export function EmptyState({ message = 'Nothing to show yet', hint, icon, action }) {
  return (
    <Box
      sx={{
        py: 6,
        px: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        color: 'text.secondary',
      }}
    >
      {icon || <InboxOutlinedIcon sx={{ fontSize: 44, mb: 1, opacity: 0.5 }} />}
      <Typography variant="subtitle1">{message}</Typography>
      {hint && (
        <Typography variant="body2" sx={{ mt: 0.5, maxWidth: 420 }}>
          {hint}
        </Typography>
      )}
      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Box>
  );
}

export function LoadingState({ height = 240 }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height }}>
      <CircularProgress />
    </Box>
  );
}
