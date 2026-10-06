// Pin Pop demo interactions — vanilla JS, no library
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // Tahun footer
  $("#year").textContent = new Date().getFullYear();

  // Navbar shadow saat scroll
  var nav = $("#navbar"), toTop = $("#toTop");
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle("scrolled", y > 8);
    toTop.classList.toggle("show", y > 600);
    spy();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  // Hamburger mobile
  var burger = $("#hamburger"), links = $("#navLinks");
  burger.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });
  $$(".nav-link, .nav-cta", links).forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open"); burger.classList.remove("open");
    });
  });

  // Scroll-spy: tandai link aktif
  var sections = ["beranda", "layanan", "harga", "galeri", "cara", "pesan", "tentang", "kontak"]
    .map(function (id) { return document.getElementById(id); }).filter(Boolean);
  function spy() {
    var pos = window.scrollY + 120, current = sections[0] && sections[0].id;
    sections.forEach(function (s) { if (s.offsetTop <= pos) current = s.id; });
    $$(".nav-link").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("href") === "#" + current);
    });
  }

  // Reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(function (el) { io.observe(el); });


  // Tombol paket -> preselect form + scroll
  var paketSelect = $("#paket"), jumlahInput = $("#jumlah");
  var jumlahMap = { "Paket Digital": 0, "Digital + Cetak": 25, "Revisi Tambahan": 0, "Custom": 0 };
  $$("[data-paket]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var val = btn.dataset.paket;
      var exists = $$("option", paketSelect).some(function (o) { return o.value === val; });
      paketSelect.value = exists ? val : "Custom";
      if (val in jumlahMap) jumlahInput.value = jumlahMap[val];
      document.getElementById("pesan").scrollIntoView({ behavior: "smooth" });
      toast("Paket \"" + val + "\" dipilih — tinggal lengkapi form 👇", false);
    });
  });

  // Filter galeri
  $$(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      $$(".chip").forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      var f = chip.dataset.filter;
      $$(".g-item").forEach(function (item) {
        item.classList.toggle("hide", f !== "all" && item.dataset.cat !== f);
      });
    });
  });

  // Lightbox galeri
  var lb = $("#lightbox"), lbPh = $("#lbPh"), lbCap = $("#lbCap");
  function closeLb() { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  $("#lbClose").addEventListener("click", closeLb);
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLb(); });
  $$(".g-item").forEach(function (item) {
    item.addEventListener("click", function (e) {
      if (e.target.closest("a,button")) return; // tombol Pesan: biarkan aksi preselect paket jalan
      var img = $("img.pin-photo", item);
      var ph = $(".pin-real", item);
      if (!img && !ph) return;
      lbPh.className = "lb-ph pin-zoom";
      if (img) { lbPh.innerHTML = ""; var big = document.createElement("img"); big.src = img.src; big.alt = img.alt; lbPh.appendChild(big); }
      else { lbPh.textContent = ph.textContent; }
      lbCap.textContent = item.dataset.title || $("figcaption", item).textContent;
      lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });
  // Toast
  var toastEl = $("#toast"), toastTimer = null;
  function toast(msg, isSuccess) {
    if (msg) toastEl.textContent = msg;
    toastEl.style.borderLeftColor = isSuccess === false ? "#F59E0B" : "#22C55E";
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 4200);
  }

  // Validasi + submit form
  var form = $("#orderForm");
  function setErr(id, msg) {
    var input = document.getElementById(id);
    var err = document.querySelector('[data-err="' + id + '"]');
    if (err) err.textContent = msg || "";
    if (input) input.classList.toggle("invalid", !!msg);
    return !msg;
  }
  var WA_ADMIN = "6285387881619";
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nama = $("#nama").value.trim();
    var wa = $("#wa").value.replace(/[\s\-.]/g, "");
    var desk = $("#deskripsi").value.trim();
    var jumlah = $("#jumlah").value;
    var paket = paketSelect.value;

    var ok = true;
    ok = setErr("nama", nama.length < 3 ? "Isi nama minimal 3 huruf ya." : "") && ok;
    ok = setErr("wa", /^(\+?62|0)8\d{7,11}$/.test(wa) ? "" : "Nomor WA tidak valid (cth: 081234567890).") && ok;
    ok = setErr("deskripsi", desk.length < 10 ? "Ceritakan konsepmu minimal 10 karakter." : "") && ok;
    ok = setErr("jumlah", (jumlah !== "" && (+jumlah < 0 || +jumlah > 1000)) ? "Jumlah pin 0–1000." : "") && ok;
    if (!ok) { toast("⚠️ Cek lagi form-nya, ada yang kurang tepat.", false); return; }

    var btn = $("#submitBtn");
    btn.disabled = true; btn.textContent = "Membuka WhatsApp… ⏳";

    var fileInput = $("#referensi");
    var fileName = (fileInput && fileInput.files[0]) ? fileInput.files[0].name : "-";
    var lines = [
      "Halo Pin Pop! Saya mau pesan:",
      "- Nama: " + nama,
      "- WA: " + wa,
      "- Paket: " + paket,
      "- Jumlah pin: " + (jumlah === "" ? "-" : jumlah),
      "- Konsep: " + desk,
      "- Referensi: " + fileName
    ];
    var url = "https://wa.me/" + WA_ADMIN + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener"); // sync: di dalam user gesture agar tidak diblokir popup-blocker

    setTimeout(function () {
      btn.disabled = false; btn.textContent = "Kirim Pesanan 🚀";
      toast("✅ Pesanan diteruskan ke WhatsApp — tinggal tekan kirim di chat yang terbuka 🙏", true);
      form.reset(); paketSelect.value = "Paket Digital"; jumlahInput.value = 0;
      $("#fileName").textContent = "Belum ada file dipilih";
    }, 600);
  });
  // Hapus error saat mengetik
  ["nama", "wa", "deskripsi", "jumlah"].forEach(function (id) {
    document.getElementById(id).addEventListener("input", function () { setErr(id, ""); });
  });

  // Back to top
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  onScroll();
})();
