import { useState, useEffect } from 'react';
import exifr from 'exifr';
import {
  Info,
  Camera,
  MapPin,
  Settings,
  Eye,
  EyeOff,
  ExternalLink,
  File as FileIcon,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { ImageFile } from '@/shared/types';

interface MetadataSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  data: Record<string, unknown>;
}

type MetadataRecord = Record<string, unknown>;

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function MetadataControls({ image }: { image: ImageFile }) {
  const [sections, setSections] = useState<MetadataSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rawData, setRawData] = useState<MetadataRecord | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    exifr
      .parse(image.file, {
        pick: ['*'],   // fixed: array instead of boolean
        gps: true,
        interop: true,
        xmp: true,
        iptc: true,
        icc: true,
        translateKeys: true,
        translateValues: true,
      })
      .then((data) => {
        if (cancelled) return;
        if (data) {
          setRawData(data);
          const secs = buildSections(data as MetadataRecord, image);
          setSections(secs);
          if (secs.length > 0) {
            setExpandedSections(new Set([secs[0].id]));
          }
        } else {
          setSections([]);
          setRawData(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Metadata parse error:', err);
        setError(err instanceof Error ? err.message : 'Failed to parse metadata');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [image]);

  function buildSections(data: MetadataRecord, image: ImageFile): MetadataSection[] {
    const sections: MetadataSection[] = [];

    // File info section
    const fileInfo: Record<string, unknown> = {
      'File Name': image.file.name,
      'File Size': formatBytes(image.file.size),
      'File Type': image.file.type || 'Unknown',
      'Dimensions': image.dimensions ? `${image.dimensions.width} × ${image.dimensions.height}` : 'Unknown',
      'Last Modified': new Date(image.file.lastModified).toLocaleString(),
    };
    if (data.ColorSpace) fileInfo['Color Space'] = data.ColorSpace;
    if (data.BitsPerSample) fileInfo['Bits Per Sample'] = String(data.BitsPerSample);
    sections.push({
      id: 'file',
      icon: <FileIcon size={18} />,
      title: 'File Information',
      data: fileInfo,
    });

    // Camera / EXIF section
    const exifKeys = [
      'Make', 'Model', 'Software', 'Artist', 'Copyright', 'DateTimeOriginal',
      'ExposureTime', 'FNumber', 'ISOSpeedRatings', 'FocalLength', 'Flash',
      'MeteringMode', 'ExposureProgram', 'ExposureBiasValue', 'WhiteBalance',
      'LensModel', 'LensMake', 'ShutterSpeedValue', 'ApertureValue',
      'FocalLengthIn35mmFormat', 'DigitalZoomRatio', 'SceneCaptureType',
      'GainControl', 'Contrast', 'Saturation', 'Sharpness', 'SubjectDistanceRange',
    ];
    const camData: Record<string, unknown> = {};
    for (const key of exifKeys) {
      if (data[key] !== undefined) {
        camData[key] = data[key];
      }
    }
    if (Object.keys(camData).length > 0) {
      sections.push({
        id: 'camera',
        icon: <Camera size={18} />,
        title: 'Camera & Exposure',
        data: camData,
      });
    }

    // GPS section
    let gpsData: Record<string, unknown> = {};
    if (data.latitude || data.longitude || data.GPSLatitude || data.GPSLongitude) {
      gpsData = {};
      if (data.latitude) gpsData['Latitude'] = data.latitude;
      if (data.longitude) gpsData['Longitude'] = data.longitude;
      if (data.GPSAltitude) gpsData['Altitude'] = data.GPSAltitude;
      if (data.GPSImgDirection) gpsData['Image Direction'] = data.GPSImgDirection;
      if (data.GPSSpeed) gpsData['Speed'] = data.GPSSpeed;
      if (data.GPSDateStamp) gpsData['GPS Date'] = data.GPSDateStamp;
      if (data.GPSTimeStamp) gpsData['GPS Time'] = data.GPSTimeStamp;
      sections.push({
        id: 'gps',
        icon: <MapPin size={18} />,
        title: 'GPS Coordinates',
        data: gpsData,
      });
    }

    // IPTC section
    const iptcKeys = [
      'ObjectName', 'Caption', 'CaptionWriter', 'Headline', 'SpecialInstructions',
      'Byline', 'BylineTitle', 'Credit', 'Source', 'CopyrightNotice', 'Keywords',
      'City', 'SubLocation', 'ProvinceState', 'CountryPrimaryLocationName',
      'OriginalTransmissionReference', 'DateCreated', 'TimeCreated',
    ];
    const iptcData: Record<string, unknown> = {};
    for (const key of iptcKeys) {
      if (data[key] !== undefined) {
        iptcData[key] = data[key];
      }
    }
    if (Object.keys(iptcData).length > 0) {
      sections.push({
        id: 'iptc',
        icon: <Info size={18} />,
        title: 'IPTC / Creator',
        data: iptcData,
      });
    }

    // XMP section
    const xmpData: Record<string, unknown> = {};
    for (const key of Object.keys(data)) {
      if (key.startsWith('XMP') || key.startsWith('xmp')) {
        xmpData[key] = data[key];
      }
    }
    if (Object.keys(xmpData).length > 0) {
      sections.push({
        id: 'xmp',
        icon: <Settings size={18} />,
        title: 'XMP Metadata',
        data: xmpData,
      });
    }

    // ICC Profile
    if (data.ICCProfile) {
      sections.push({
        id: 'icc',
        icon: <Settings size={18} />,
        title: 'ICC Profile',
        data: { 'ICC Profile': 'Present' },
      });
    }

    // Other remaining properties
    const usedKeys = new Set([
      ...exifKeys, 'ColorSpace', 'BitsPerSample', 'ICCProfile',
      ...Object.keys(fileInfo), ...Object.keys(camData), ...Object.keys(gpsData), ...iptcKeys,
    ]);
    const otherData: Record<string, unknown> = {};
    for (const key of Object.keys(data)) {
      if (!usedKeys.has(key) && !key.startsWith('GPS') && !key.startsWith('XMP') && !key.startsWith('xmp')) {
        otherData[key] = data[key];
      }
    }
    if (Object.keys(otherData).length > 0) {
      sections.push({
        id: 'other',
        icon: <Settings size={18} />,
        title: 'Other Metadata',
        data: otherData,
      });
    }

    return sections;
  }

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(sections.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  const renderValue = (value: unknown) => {
    if (value === undefined || value === null) return '—';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const isGpsCoord = (key: string) => key === 'Latitude' || key === 'Longitude';

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Info size={20} className="text-primary-500" />
          Image Metadata
        </h3>
        {sections.length > 0 && (
          <div className="flex gap-2">
            <button onClick={expandAll} className="text-xs text-gray-500 hover:text-gray-700">Expand All</button>
            <button onClick={collapseAll} className="text-xs text-gray-500 hover:text-gray-700">Collapse All</button>
          </div>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="ml-3 text-sm text-gray-500">Reading metadata...</span>
        </div>
      )}

      {error && (
        <div className="rounded-card border p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          <p>Error reading metadata: {error}</p>
        </div>
      )}

      {!loading && !error && sections.length === 0 && (
        <div className="rounded-card border p-8 text-center bg-surface dark:bg-surface">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No metadata found in this image.</p>
          <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">Screenshots and social media images often have metadata removed.</p>
        </div>
      )}

      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          return (
            <div key={section.id} className="rounded-card border bg-surface dark:bg-surface overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-primary-500">{section.icon}</span>
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">{section.title}</h4>
                  <span className="text-xs text-gray-400">({Object.keys(section.data).length})</span>
                </div>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 space-y-1">
                  {Object.entries(section.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-xs py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <span className="text-gray-500 dark:text-gray-400 min-w-[30%]">{key}</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200 text-right max-w-[65%] break-words">
                        {isGpsCoord(key) ? (
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent(renderValue(value))}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
                          >
                            {renderValue(value)} <ExternalLink size={10} />
                          </a>
                        ) : (
                          renderValue(value)
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {rawData && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
          >
            {showRaw ? <EyeOff size={14} /> : <Eye size={14} />}
            {showRaw ? 'Hide raw JSON' : 'Show raw JSON'}
          </button>
        </div>
      )}

      {showRaw && rawData && (
        <div className="rounded-card border p-4 bg-surface dark:bg-surface max-h-64 overflow-auto">
          <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {JSON.stringify(rawData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}