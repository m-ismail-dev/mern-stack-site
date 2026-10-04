import Button from "../components/Button";

function Home() {
  return (
    <div className="relative min-h-screen bg-[url(bg.jpg)] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative flex flex-col justify-center items-center z-10 h-dvh">
        <div className="inset-0 bg-emerald-900/50 border border-emerald-950 rounded-xl p-5">
          <h1 className="text-white text-5xl">Sudan's biggest labour site</h1>
        </div>
        <div className="mt-5">
          <Button href="/login">Find a labour</Button>
          <Button href="/login">Join our team</Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
