export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatLatency = (ms: number): string => {
  return `${ms.toFixed(1)}ms`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatUptime = (percentage: number): string => {
  return `${percentage.toFixed(2)}%`;
};

export const getStatusFromMetric = (value: number, thresholds: { warning: number; critical: number }, invert = false): 'success' | 'warning' | 'danger' => {
  if (invert) {
    if (value <= thresholds.critical) return 'danger';
    if (value <= thresholds.warning) return 'warning';
    return 'success';
  } else {
    if (value >= thresholds.critical) return 'danger';
    if (value >= thresholds.warning) return 'warning';
    return 'success';
  }
};