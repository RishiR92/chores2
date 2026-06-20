export function MeshBackdrop() {
  return (
    <div className="mesh-root" aria-hidden>
      <div
        className="mesh-blob"
        style={{
          width: "60vw", height: "60vw",
          top: "-15vw", left: "-10vw",
          background: "#7C3AED",
          animation: "mesh-drift-a 28s ease-in-out infinite",
        }}
      />
      <div
        className="mesh-blob"
        style={{
          width: "55vw", height: "55vw",
          top: "10vh", right: "-15vw",
          background: "#E64BFF",
          animation: "mesh-drift-b 34s ease-in-out infinite",
        }}
      />
      <div
        className="mesh-blob"
        style={{
          width: "50vw", height: "50vw",
          bottom: "-10vh", left: "10vw",
          background: "#5B5BFF",
          animation: "mesh-drift-c 40s ease-in-out infinite",
          opacity: 0.45,
        }}
      />
      <div
        className="mesh-blob"
        style={{
          width: "40vw", height: "40vw",
          top: "40vh", left: "30vw",
          background: "#A5D8FF",
          animation: "mesh-drift-d 26s ease-in-out infinite",
          opacity: 0.40,
        }}
      />
      <div className="mesh-noise" />
    </div>
  );
}
