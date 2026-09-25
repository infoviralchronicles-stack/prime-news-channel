import { ImageResponse } from 'next/og';

export const size = {
  width: 192,
  height: 192,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 130,
          background: '#111111',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: 42,
          fontFamily: 'serif',
          fontWeight: 900,
          border: '4px solid #333333',
          position: 'relative',
        }}
      >
        <span style={{ marginTop: -10, marginRight: 8 }}>P</span>
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            right: 24,
            width: 34,
            height: 34,
            borderRadius: '50%',
            backgroundColor: '#dc2626',
            border: '3px solid #111111',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
