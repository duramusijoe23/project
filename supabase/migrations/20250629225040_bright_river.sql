-- NetAI Monitor Database Schema
-- Comprehensive offline database for AI network monitoring

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Network Infrastructure Tables
CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('router', 'switch', 'server', 'workstation', 'mobile', 'iot', 'ai_node')),
    ip_address TEXT NOT NULL,
    mac_address TEXT,
    location TEXT,
    status TEXT DEFAULT 'unknown' CHECK (status IN ('online', 'offline', 'warning', 'error')),
    is_ai_node BOOLEAN DEFAULT FALSE,
    last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS network_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    device_id TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    bandwidth_usage REAL DEFAULT 0,
    latency REAL DEFAULT 0,
    packet_loss REAL DEFAULT 0,
    throughput REAL DEFAULT 0,
    uptime_percentage REAL DEFAULT 0,
    active_connections INTEGER DEFAULT 0,
    cpu_usage REAL DEFAULT 0,
    memory_usage REAL DEFAULT 0,
    FOREIGN KEY (device_id) REFERENCES devices(device_id)
);

-- AI Model Performance Tables
CREATE TABLE IF NOT EXISTS ai_models (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('anomaly_detection', 'intrusion_detection', 'ddos_detection', 'behavior_analysis', 'malware_detection')),
    version TEXT NOT NULL,
    status TEXT DEFAULT 'offline' CHECK (status IN ('active', 'training', 'updating', 'offline')),
    accuracy REAL DEFAULT 0,
    precision_score REAL DEFAULT 0,
    recall REAL DEFAULT 0,
    f1_score REAL DEFAULT 0,
    confidence_threshold REAL DEFAULT 0.5,
    is_ai_optimized BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS model_performance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model_id TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    accuracy REAL DEFAULT 0,
    latency REAL DEFAULT 0,
    throughput INTEGER DEFAULT 0,
    confidence_score REAL DEFAULT 0,
    drift_score REAL DEFAULT 0,
    prediction_count INTEGER DEFAULT 0,
    error_rate REAL DEFAULT 0,
    FOREIGN KEY (model_id) REFERENCES ai_models(model_id)
);

CREATE TABLE IF NOT EXISTS drift_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_id TEXT UNIQUE NOT NULL,
    model_id TEXT NOT NULL,
    drift_type TEXT NOT NULL CHECK (drift_type IN ('data', 'concept', 'prediction')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    threshold_value REAL NOT NULL,
    current_value REAL NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    FOREIGN KEY (model_id) REFERENCES ai_models(model_id)
);

-- Security and Threat Detection Tables
CREATE TABLE IF NOT EXISTS threat_alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_id TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('intrusion', 'ddos', 'anomaly', 'malware', 'data_exfiltration', 'brute_force', 'port_scan')),
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    source_ip TEXT NOT NULL,
    target_ip TEXT,
    confidence REAL DEFAULT 0,
    risk_score REAL DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'investigating', 'resolved', 'false_positive')),
    affected_assets TEXT, -- JSON array
    mitigation_actions TEXT, -- JSON array
    evidence_data TEXT, -- JSON object
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS behavior_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_id TEXT UNIQUE NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('ip', 'user', 'device', 'application')),
    entity_name TEXT NOT NULL,
    baseline_metrics TEXT NOT NULL, -- JSON object
    current_metrics TEXT NOT NULL, -- JSON object
    anomaly_score REAL DEFAULT 0,
    is_ai_entity BOOLEAN DEFAULT FALSE,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Malware Detection Tables
CREATE TABLE IF NOT EXISTS malware_signatures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    signature_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('hash', 'pattern', 'behavior', 'network')),
    signature_data TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    description TEXT,
    source TEXT NOT NULL CHECK (source IN ('internal', 'clamav', 'virustotal', 'custom')),
    is_active BOOLEAN DEFAULT TRUE,
    false_positive_rate REAL DEFAULT 0,
    detection_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS malware_detections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    detection_id TEXT UNIQUE NOT NULL,
    source_ip TEXT NOT NULL,
    target_ip TEXT,
    malware_type TEXT NOT NULL CHECK (malware_type IN ('virus', 'trojan', 'worm', 'ransomware', 'spyware', 'adware', 'rootkit', 'botnet')),
    signature_id TEXT NOT NULL,
    signature_name TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    confidence REAL DEFAULT 0,
    status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'quarantined', 'cleaned', 'false_positive')),
    affected_files TEXT, -- JSON array
    network_traffic TEXT, -- JSON object
    hash_values TEXT, -- JSON object
    mitigation_actions TEXT, -- JSON array
    is_ai_related BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (signature_id) REFERENCES malware_signatures(signature_id)
);

-- Traffic Analysis Tables
CREATE TABLE IF NOT EXISTS traffic_flows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flow_id TEXT UNIQUE NOT NULL,
    source_ip TEXT NOT NULL,
    destination_ip TEXT NOT NULL,
    protocol TEXT NOT NULL,
    port INTEGER NOT NULL,
    bandwidth REAL DEFAULT 0,
    packets INTEGER DEFAULT 0,
    bytes INTEGER DEFAULT 0,
    duration INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    qos_class TEXT DEFAULT 'STANDARD' CHECK (qos_class IN ('AI_TRAFFIC', 'BUSINESS_CRITICAL', 'STANDARD', 'BACKGROUND')),
    application_name TEXT,
    is_ai_traffic BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME
);

CREATE TABLE IF NOT EXISTS bandwidth_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rule_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('user', 'ip', 'application', 'protocol', 'ai_workload')),
    target TEXT NOT NULL,
    priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 10),
    guaranteed_bandwidth INTEGER,
    max_bandwidth INTEGER,
    burst_bandwidth INTEGER,
    time_restrictions TEXT, -- JSON object
    is_active BOOLEAN DEFAULT TRUE,
    is_ai_optimized BOOLEAN DEFAULT FALSE,
    enforcement_method TEXT DEFAULT 'tc' CHECK (enforcement_method IN ('tc', 'iptables', 'custom', 'hardware')),
    violation_count INTEGER DEFAULT 0,
    bytes_transferred INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bandwidth_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_id TEXT NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('ip', 'user', 'application', 'protocol')),
    entity_name TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    current_usage REAL DEFAULT 0,
    allocated_bandwidth REAL DEFAULT 0,
    peak_usage REAL DEFAULT 0,
    total_bytes INTEGER DEFAULT 0,
    rule_id TEXT,
    is_violating BOOLEAN DEFAULT FALSE,
    is_ai_traffic BOOLEAN DEFAULT FALSE,
    qos_class TEXT DEFAULT 'standard',
    FOREIGN KEY (rule_id) REFERENCES bandwidth_rules(rule_id)
);

-- System Configuration Tables
CREATE TABLE IF NOT EXISTS system_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_key TEXT UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    config_type TEXT DEFAULT 'string' CHECK (config_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    log_id TEXT UNIQUE NOT NULL,
    user_id TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    details TEXT, -- JSON object
    ip_address TEXT,
    user_agent TEXT,
    status TEXT DEFAULT 'success' CHECK (status IN ('success', 'failure', 'error')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Feedback and Learning Tables
CREATE TABLE IF NOT EXISTS feedback_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feedback_id TEXT UNIQUE NOT NULL,
    prediction_id TEXT NOT NULL,
    model_id TEXT NOT NULL,
    actual_value TEXT NOT NULL,
    predicted_value TEXT NOT NULL,
    confidence REAL DEFAULT 0,
    is_correct BOOLEAN NOT NULL,
    user_feedback TEXT,
    feedback_type TEXT DEFAULT 'manual' CHECK (feedback_type IN ('manual', 'automated', 'verified')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (model_id) REFERENCES ai_models(model_id)
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_network_metrics_device_timestamp ON network_metrics(device_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_model_performance_model_timestamp ON model_performance(model_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_threat_alerts_status_severity ON threat_alerts(status, severity);
CREATE INDEX IF NOT EXISTS idx_malware_detections_status_severity ON malware_detections(status, severity);
CREATE INDEX IF NOT EXISTS idx_traffic_flows_timestamp ON traffic_flows(created_at);
CREATE INDEX IF NOT EXISTS idx_bandwidth_usage_timestamp ON bandwidth_usage(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_entries_model_timestamp ON feedback_entries(model_id, created_at);

-- Triggers for automatic timestamp updates
CREATE TRIGGER IF NOT EXISTS update_devices_timestamp 
    AFTER UPDATE ON devices
    BEGIN
        UPDATE devices SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_ai_models_timestamp 
    AFTER UPDATE ON ai_models
    BEGIN
        UPDATE ai_models SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_threat_alerts_timestamp 
    AFTER UPDATE ON threat_alerts
    BEGIN
        UPDATE threat_alerts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_malware_detections_timestamp 
    AFTER UPDATE ON malware_detections
    BEGIN
        UPDATE malware_detections SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER IF NOT EXISTS update_bandwidth_rules_timestamp 
    AFTER UPDATE ON bandwidth_rules
    BEGIN
        UPDATE bandwidth_rules SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Views for common queries
CREATE VIEW IF NOT EXISTS active_threats AS
SELECT 
    ta.*,
    d.name as target_device_name,
    d.location as target_location
FROM threat_alerts ta
LEFT JOIN devices d ON ta.target_ip = d.ip_address
WHERE ta.status = 'active';

CREATE VIEW IF NOT EXISTS ai_model_summary AS
SELECT 
    am.*,
    COUNT(mp.id) as performance_records,
    AVG(mp.accuracy) as avg_accuracy,
    AVG(mp.latency) as avg_latency,
    MAX(mp.timestamp) as last_performance_update
FROM ai_models am
LEFT JOIN model_performance mp ON am.model_id = mp.model_id
GROUP BY am.model_id;

CREATE VIEW IF NOT EXISTS bandwidth_violations AS
SELECT 
    bu.*,
    br.name as rule_name,
    br.max_bandwidth,
    (bu.current_usage / br.max_bandwidth * 100) as violation_percentage
FROM bandwidth_usage bu
JOIN bandwidth_rules br ON bu.rule_id = br.rule_id
WHERE bu.is_violating = TRUE
ORDER BY bu.timestamp DESC;

-- Initial configuration data
INSERT OR IGNORE INTO system_config (config_key, config_value, config_type, description) VALUES
('database_version', '1.0.0', 'string', 'Database schema version'),
('max_retention_days', '90', 'number', 'Maximum days to retain historical data'),
('alert_threshold_critical', '0.9', 'number', 'Critical alert confidence threshold'),
('alert_threshold_high', '0.7', 'number', 'High alert confidence threshold'),
('ai_traffic_priority', 'true', 'boolean', 'Enable AI traffic prioritization'),
('auto_quarantine_malware', 'true', 'boolean', 'Automatically quarantine detected malware'),
('bandwidth_monitoring_interval', '30', 'number', 'Bandwidth monitoring interval in seconds'),
('model_performance_retention', '30', 'number', 'Days to retain model performance data');