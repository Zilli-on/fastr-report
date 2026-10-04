
(() => {
  const KEY = "fastr-collaboration-reflection-v1";
  const form = document.querySelector("#reflection-form");
  const interests = [...document.querySelectorAll("[data-interest]")];
  const modes = [...document.querySelectorAll("[data-mode]")];
  const panel = document.querySelector("#share-panel");
  const toast = document.querySelector("#toast");
  let selectedInterests = [];
  let workingStyle = "mix";

  const showToast = (msg) => {
    toast.textContent = msg;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  };

  const getData = () => {
    const fd = new FormData(form);
    return {
      name: String(fd.get("name") || "").trim(),
      interests: selectedInterests,
      strongest: String(fd.get("strongest") || "").trim(),
      practice: String(fd.get("practice") || "").trim(),
      ownership: String(fd.get("ownership") || "").trim(),
      fastrIdeas: String(fd.get("fastrIdeas") || "").trim(),
      lessInteresting: String(fd.get("lessInteresting") || "").trim(),
      notes: String(fd.get("notes") || "").trim(),
      workingStyle,
      updatedAt: new Date().toISOString()
    };
  };

  const saveDraft = () => {
    try { localStorage.setItem(KEY, JSON.stringify(getData())); } catch {}
  };

  const loadDraft = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.name) form.elements.name.value = d.name;
      if (d.strongest) form.elements.strongest.value = d.strongest;
      if (d.practice) form.elements.practice.value = d.practice;
      if (d.ownership) form.elements.ownership.value = d.ownership;
      if (d.fastrIdeas) form.elements.fastrIdeas.value = d.fastrIdeas;
      if (d.lessInteresting) form.elements.lessInteresting.value = d.lessInteresting;
      if (d.notes) form.elements.notes.value = d.notes;
      selectedInterests = Array.isArray(d.interests) ? d.interests : [];
      workingStyle = ["breit","ownership","mix"].includes(d.workingStyle) ? d.workingStyle : "mix";
      syncButtons();
    } catch {}
  };

  const syncButtons = () => {
    interests.forEach(btn => {
      const active = selectedInterests.includes(btn.dataset.interest);
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
      const mark = btn.querySelector("span");
      if (mark) mark.textContent = active ? "✓" : "+";
    });
    modes.forEach(btn => {
      const active = btn.dataset.mode === workingStyle;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  };

  interests.forEach(btn => btn.addEventListener("click", () => {
    const item = btn.dataset.interest;
    selectedInterests = selectedInterests.includes(item)
      ? selectedInterests.filter(x => x !== item)
      : [...selectedInterests, item];
    syncButtons();
    saveDraft();
  }));

  modes.forEach(btn => btn.addEventListener("click", () => {
    workingStyle = btn.dataset.mode;
    syncButtons();
    saveDraft();
  }));

  form.addEventListener("input", saveDraft);

  const labelForMode = (v) => ({
    breit: "Breit starten: möglichst viel kennenlernen",
    ownership: "Schnell Ownership: klaren Bereich übernehmen",
    mix: "Mix: breit starten, dann früh fokussieren"
  }[v] || v);

  const format = (d) => [
    "FASTR · Collaboration Reflection",
    "",
    "Name: " + (d.name || "–"),
    "Interessen: " + (d.interests.length ? d.interests.join(", ") : "–"),
    "Startmodus: " + labelForMode(d.workingStyle),
    "",
    "MEINE STÄRKEN",
    d.strongest || "–",
    "",
    "WO MIR PRAXIS FEHLT",
    d.practice || "–",
    "",
    "WAS ICH GERNE VERANTWORTEN WÜRDE",
    d.ownership || "–",
    "",
    "MEINE IDEEN FÜR FASTR",
    d.fastrIdeas || "–",
    "",
    "WAS MICH EHER NICHT INTERESSIERT",
    d.lessInteresting || "–",
    "",
    "SONSTIGE GEDANKEN / FRAGEN",
    d.notes || "–"
  ].join("\n");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    saveDraft();
    panel.classList.add("show");
    panel.scrollIntoView({behavior:"smooth", block:"center"});
  });

  document.querySelector("#share-native").addEventListener("click", async () => {
    const text = format(getData());
    if (navigator.share) {
      try {
        await navigator.share({title:"FASTR · Collaboration Reflection", text});
      } catch (e) {
        if (e && e.name !== "AbortError") showToast("Teilen konnte nicht geöffnet werden.");
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        showToast("Antworten kopiert. Jetzt einfach in WhatsApp einfügen.");
      } catch {
        showToast("Bitte die Kopieren-Funktion verwenden.");
      }
    }
  });

  document.querySelector("#copy-answers").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(format(getData()));
      showToast("Antworten kopiert.");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = format(getData());
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
      showToast("Antworten kopiert.");
    }
  });

  document.querySelector("#clear-draft").addEventListener("click", () => {
    if (!confirm("Gespeicherte Antworten wirklich zurücksetzen?")) return;
    form.reset();
    selectedInterests = [];
    workingStyle = "mix";
    syncButtons();
    panel.classList.remove("show");
    try { localStorage.removeItem(KEY); } catch {}
    showToast("Entwurf zurückgesetzt.");
  });

  loadDraft();
  syncButtons();
})();
