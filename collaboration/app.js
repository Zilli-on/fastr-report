(() => {
  const KEY = "fastr-collaboration-reflection-v2";
  const form = document.querySelector("#reflection-form");
  const nav = document.querySelector("#site-nav");
  const progress = document.querySelector("#scroll-progress");
  const heroVideo = document.querySelector("#hero-video");
  const toast = document.querySelector("#toast");
  const steps = [...document.querySelectorAll(".step")];
  const progressButtons = [...document.querySelectorAll(".wizard-progress button")];
  const interests = [...document.querySelectorAll("[data-interest]")];
  const modes = [...document.querySelectorAll("[data-mode]")];
  const sharePanel = document.querySelector("#share-panel");
  let currentStep = 0;
  let selectedInterests = [];
  let workingStyle = "mix";

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
  };

  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? (scrollY / max) * 100 : 0;
    progress.style.width = pct + "%";
    nav.classList.toggle("scrolled", scrollY > 48);
  };
  addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();

  if (heroVideo) {
    heroVideo.play().catch(() => {});
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) heroVideo.pause();
      else heroVideo.play().catch(() => {});
    });
  }

  const syncButtons = () => {
    interests.forEach((btn) => {
      const active = selectedInterests.includes(btn.dataset.interest);
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
      const mark = btn.querySelector("span");
      if (mark) mark.textContent = active ? "✓" : "+";
    });
    modes.forEach((btn) => {
      const active = btn.dataset.mode === workingStyle;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
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
      ["name","strongest","practice","ownership","fastrIdeas","lessInteresting","notes"].forEach((name) => {
        if (d[name] && form.elements[name]) form.elements[name].value = d[name];
      });
      selectedInterests = Array.isArray(d.interests) ? d.interests : [];
      workingStyle = ["breit","ownership","mix"].includes(d.workingStyle) ? d.workingStyle : "mix";
    } catch {}
    syncButtons();
  };

  const showStep = (index) => {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((s, i) => s.classList.toggle("active", i === currentStep));
    progressButtons.forEach((b, i) => {
      b.classList.toggle("active", i === currentStep);
      b.setAttribute("aria-current", i === currentStep ? "step" : "false");
    });
  };

  const validateStep = () => {
    const required = steps[currentStep].querySelectorAll("[required]");
    for (const field of required) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  };

  progressButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      if (index <= currentStep || validateStep()) showStep(index);
    });
  });

  document.querySelectorAll("[data-next]").forEach((button) => button.addEventListener("click", () => {
    if (!validateStep()) return;
    saveDraft();
    showStep(currentStep + 1);
    document.querySelector("#reflection").scrollIntoView({ behavior: "smooth", block: "start" });
  }));
  document.querySelectorAll("[data-prev]").forEach((button) => button.addEventListener("click", () => {
    showStep(currentStep - 1);
  }));

  interests.forEach((btn) => btn.addEventListener("click", () => {
    const item = btn.dataset.interest;
    selectedInterests = selectedInterests.includes(item)
      ? selectedInterests.filter((x) => x !== item)
      : [...selectedInterests, item];
    syncButtons();
    saveDraft();
  }));

  modes.forEach((btn) => btn.addEventListener("click", () => {
    workingStyle = btn.dataset.mode;
    syncButtons();
    saveDraft();
  }));

  form.addEventListener("input", saveDraft);

  const modeLabel = (value) => ({
    breit: "Breit starten: möglichst viel kennenlernen",
    ownership: "Ownership: schnell einen klaren Bereich übernehmen",
    mix: "Mix: breit starten, dann früh fokussieren"
  }[value] || value);

  const formatAnswers = (d) => [
    "FASTR · Collaboration Reflection",
    "",
    "Name: " + (d.name || "–"),
    "Interessen: " + (d.interests.length ? d.interests.join(", ") : "–"),
    "Startmodus: " + modeLabel(d.workingStyle),
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateStep()) return;
    saveDraft();
    sharePanel.classList.add("show");
    sharePanel.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  document.querySelector("#share-native").addEventListener("click", async () => {
    const text = formatAnswers(getData());
    if (navigator.share) {
      try {
        await navigator.share({ title: "FASTR · Collaboration Reflection", text });
      } catch (error) {
        if (error?.name !== "AbortError") showToast("Teilen konnte nicht geöffnet werden.");
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        showToast("Antworten kopiert. Jetzt einfach in WhatsApp einfügen.");
      } catch { showToast("Bitte Antworten kopieren verwenden."); }
    }
  });

  document.querySelector("#copy-answers").addEventListener("click", async () => {
    const text = formatAnswers(getData());
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    showToast("Antworten kopiert.");
  });

  document.querySelector("#clear-draft").addEventListener("click", () => {
    if (!confirm("Gespeicherte Antworten wirklich zurücksetzen?")) return;
    form.reset();
    selectedInterests = [];
    workingStyle = "mix";
    sharePanel.classList.remove("show");
    try { localStorage.removeItem(KEY); } catch {}
    syncButtons();
    showStep(0);
    showToast("Entwurf zurückgesetzt.");
  });

  loadDraft();
  syncButtons();
  showStep(0);
})();