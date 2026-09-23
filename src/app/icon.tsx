import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: '#111111',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: 7,
          fontFamily: 'serif',
          fontWeight: 900,
          border: '1px solid #333333',
          position: 'relative',
        }}
      >
        <span style={{ marginTop: -2, marginRight: 2 }}>P</span>
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            width: 6,
            height: 6,
            borderRadius: '50%',
            backgroundColor: '#dc2626',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
