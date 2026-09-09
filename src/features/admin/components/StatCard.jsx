import { Card, CardContent, Box, Typography, Skeleton, Avatar } from '@mui/material';

/**
 * Headline metric tile. Renders a skeleton while loading so the dashboard does
 * not jump around as figures arrive.
 */
export default function StatCard({ label, value, icon, color = 'primary', loading, caption }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {label}
            </Typography>

            {loading ? (
              <Skeleton width={110} height={40} />
            ) : (
              <Typography variant="h4" sx={{ mt: 0.5 }}>
                {value}
              </Typography>
            )}

            {caption && !loading && (
              <Typography variant="caption" color="text.secondary">
                {caption}
              </Typography>
            )}
          </Box>

          {icon && (
            <Avatar
              variant="rounded"
              sx={{
                bgcolor: (theme) => `${theme.palette[color].main}1A`,
                color: `${color}.main`,
                width: 44,
                height: 44,
              }}
            >
              {icon}
            </Avatar>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
