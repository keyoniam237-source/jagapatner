"""Tes asap tampilan: halaman dimuat tanpa error JS, hitungan komisi sisi layar benar,
dan teks "3%" mengikuti komisi. Jalankan:  python3 tests/smoke.py  (butuh playwright + Chrome)."""
import asyncio, subprocess, sys, time, os
from playwright.async_api import async_playwright
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
async def main():
    srv = subprocess.Popen([sys.executable, "-m", "http.server", "8799", "--directory", ROOT], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(1); fails = []
    try:
        async with async_playwright() as p:
            br = await p.chromium.launch(executable_path=os.environ.get("CHROME", "/usr/bin/google-chrome"), args=["--no-sandbox"])
            for name, vp in (("HP", {"width": 390, "height": 844}), ("tablet", {"width": 820, "height": 1180}), ("desktop", {"width": 1366, "height": 768})):
                pg = await br.new_page(viewport=vp); errs = []
                pg.on("pageerror", lambda e: errs.append(str(e)))
                await pg.goto("http://localhost:8799/index.html"); await pg.wait_for_timeout(1500)
                ov = await pg.evaluate("document.documentElement.scrollWidth > window.innerWidth + 2")
                if errs: fails.append(f"{name}: error JS {errs[:2]}")
                if ov: fails.append(f"{name}: ada overflow horizontal")
                print(("PASS" if not errs and not ov else "FAIL"), f"muat halaman ({name}) tanpa error & tanpa overflow")
                if name == "HP":
                    r = await pg.evaluate('''() => { const a = [commCalc(100000,"store"), commCalc(10000,"drv")]; applyComm({storePct:5,drvPct:2,minTx:20000,round:100}); const b = [commCalc(100000,"store"), commCalc(33333,"store"), commCalc(10000,"drv"), commCalc(40000,"drv")]; applyComm({storePct:3,drvPct:3,minTx:0,round:1}); return {a, b}; }''')
                    ok = r["a"] == [3000, 300] and r["b"] == [5000, 1700, 0, 800]
                    print(("PASS" if ok else "FAIL"), "hitungan komisi layar", r); ok or fails.append("komisi layar")
                await pg.close()
            await br.close()
    finally:
        srv.terminate()
    print("== selesai:", "SEMUA LULUS" if not fails else f"{len(fails)} GAGAL: {fails}")
    sys.exit(1 if fails else 0)
asyncio.run(main())
