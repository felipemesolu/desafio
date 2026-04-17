/**
 * Agendamento Modal — Aldeia Beach Clube
 * Horários disponíveis:
 *   Seg–Sex: 08:00–17:00 (slots a cada hora)
 *   Sáb–Dom: 08:00–14:00 (slots a cada hora)
 */

(function () {
  const WA_NUMBER = '5527996524763';

  /* ── Helpers ─────────────────────────────────────────────── */
  const PT_MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const PT_DAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const PT_DAYS_LONG = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

  function getSlots(dayOfWeek) {
    // 0=Dom, 6=Sáb
    const isSatSun = dayOfWeek === 0 || dayOfWeek === 6;
    const endHour = isSatSun ? 14 : 17;
    const slots = [];
    for (let h = 8; h < endHour; h++) {
      slots.push(`${String(h).padStart(2, '0')}:00`);
    }
    return slots;
  }

  function isPastDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  /* ── Modal HTML ───────────────────────────────────────────── */
  function buildModal() {
    const modal = document.createElement('div');
    modal.id = 'scheduling-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'sched-title');
    modal.innerHTML = `
      <div class="sched-overlay" id="sched-overlay"></div>
      <div class="sched-panel">

        <!-- Header -->
        <div class="sched-header">
          <div>
            <p class="sched-eyebrow">Aldeia Beach Clube</p>
            <h2 class="sched-title" id="sched-title">Agendar Visita</h2>
          </div>
          <button class="sched-close" id="sched-close" aria-label="Fechar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Steps indicator -->
        <div class="sched-steps">
          <div class="sched-step active" id="step-ind-1"><span>1</span> Data</div>
          <div class="sched-step-line"></div>
          <div class="sched-step" id="step-ind-2"><span>2</span> Horário</div>
          <div class="sched-step-line"></div>
          <div class="sched-step" id="step-ind-3"><span>3</span> Confirmar</div>
        </div>

        <!-- Step 1: Calendar -->
        <div class="sched-body" id="sched-step-1">
          <p class="sched-label">Selecione a data da visita</p>
          <div class="sched-calendar">
            <div class="cal-nav">
              <button class="cal-arrow" id="cal-prev" aria-label="Mês anterior">&#8592;</button>
              <span class="cal-month-label" id="cal-month-label"></span>
              <button class="cal-arrow" id="cal-next" aria-label="Próximo mês">&#8594;</button>
            </div>
            <div class="cal-weekdays">
              ${PT_DAYS_SHORT.map(d => `<span>${d}</span>`).join('')}
            </div>
            <div class="cal-grid" id="cal-grid"></div>
          </div>
          <p class="sched-hint"><span class="sched-dot avail"></span>Disponível &nbsp; <span class="sched-dot unavail"></span>Indisponível</p>
        </div>

        <!-- Step 2: Time Slots -->
        <div class="sched-body hidden" id="sched-step-2">
          <p class="sched-label">Escolha o horário para <strong id="sched-date-display"></strong></p>
          <div class="sched-slots" id="sched-slots"></div>
          <button class="sched-back" id="sched-back-1">&#8592; Voltar</button>
        </div>

        <!-- Step 3: Confirm -->
        <div class="sched-body hidden" id="sched-step-3">
          <div class="sched-confirm-card">
            <div class="sched-confirm-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
            </div>
            <h3 class="sched-confirm-title">Confirme seu agendamento</h3>
            <div class="sched-summary" id="sched-summary"></div>
            <p class="sched-confirm-note">Você será redirecionado ao WhatsApp para confirmar com o corretor.</p>
          </div>
          <div class="sched-action-row">
            <button class="sched-back" id="sched-back-2">&#8592; Voltar</button>
            <a class="sched-wa-btn" id="sched-wa-btn" href="#" target="_blank" rel="noopener">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Enviar pelo WhatsApp
            </a>
          </div>
        </div>

      </div>
    `;
    document.body.appendChild(modal);
    return modal;
  }

  /* ── State ────────────────────────────────────────────────── */
  let currentYear, currentMonth, selectedDate = null, selectedTime = null;

  /* ── Calendar render ──────────────────────────────────────── */
  function renderCalendar() {
    const label = document.getElementById('cal-month-label');
    label.textContent = `${PT_MONTHS[currentMonth]} ${currentYear}`;

    const grid = document.getElementById('cal-grid');
    grid.innerHTML = '';

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date(); today.setHours(0, 0, 0, 0);

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      grid.appendChild(Object.assign(document.createElement('div'), { className: 'cal-cell empty' }));
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(currentYear, currentMonth, d);
      const dow = date.getDay();
      const past = date < today;
      const cell = document.createElement('button');
      cell.className = 'cal-cell' + (past ? ' past' : ' avail');
      cell.textContent = d;
      cell.setAttribute('aria-label', `${d} de ${PT_MONTHS[currentMonth]}`);
      if (past) {
        cell.disabled = true;
      } else {
        cell.addEventListener('click', () => selectDate(date));
      }
      // Highlight selected
      if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
        cell.classList.add('selected');
      }
      grid.appendChild(cell);
    }
  }

  function selectDate(date) {
    selectedDate = date;
    selectedTime = null;
    goToStep(2);
    renderSlots();
    const display = document.getElementById('sched-date-display');
    display.textContent = `${selectedDate.getDate()} de ${PT_MONTHS[selectedDate.getMonth()]} (${PT_DAYS_LONG[selectedDate.getDay()]})`;
  }

  /* ── Time slots ───────────────────────────────────────────── */
  function renderSlots() {
    const container = document.getElementById('sched-slots');
    container.innerHTML = '';
    const slots = getSlots(selectedDate.getDay());
    if (slots.length === 0) {
      container.innerHTML = '<p class="sched-no-slots">Sem horários disponíveis neste dia.</p>';
      return;
    }
    slots.forEach(time => {
      const btn = document.createElement('button');
      btn.className = 'slot-btn';
      btn.textContent = time;
      btn.addEventListener('click', () => {
        selectedTime = time;
        goToStep(3);
        renderConfirm();
      });
      container.appendChild(btn);
    });
  }

  /* ── Confirmation ─────────────────────────────────────────── */
  function renderConfirm() {
    const summary = document.getElementById('sched-summary');
    const dateStr = `${selectedDate.getDate()} de ${PT_MONTHS[selectedDate.getMonth()]} de ${selectedDate.getFullYear()} (${PT_DAYS_LONG[selectedDate.getDay()]})`;
    summary.innerHTML = `
      <div class="sched-summary-row"><span>📅 Data:</span><strong>${dateStr}</strong></div>
      <div class="sched-summary-row"><span>⏰ Horário:</span><strong>${selectedTime}</strong></div>
    `;
    const message = encodeURIComponent(
      `Olá, Leonardo! Tenho interesse em mais informações e gostaria de agendar uma visita ao Stand / Obra no dia e hora abaixo.\n\n📅 Data: ${dateStr}\n⏰ Horário: ${selectedTime}`
    );
    document.getElementById('sched-wa-btn').href = `https://wa.me/${WA_NUMBER}?text=${message}`;
  }

  /* ── Step navigation ──────────────────────────────────────── */
  function goToStep(n) {
    [1, 2, 3].forEach(i => {
      document.getElementById(`sched-step-${i}`).classList.toggle('hidden', i !== n);
      const ind = document.getElementById(`step-ind-${i}`);
      ind.classList.toggle('active', i <= n);
      ind.classList.toggle('done', i < n);
    });
  }

  /* ── Open / Close ─────────────────────────────────────────── */
  function openModal() {
    const modal = document.getElementById('scheduling-modal');
    // Reset state
    selectedDate = null;
    selectedTime = null;
    const now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth();
    goToStep(1);
    renderCalendar();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('scheduling-modal').classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {
    buildModal();

    // Calendar navigation
    document.getElementById('cal-prev').addEventListener('click', () => {
      if (currentMonth === 0) { currentMonth = 11; currentYear--; }
      else currentMonth--;
      renderCalendar();
    });
    document.getElementById('cal-next').addEventListener('click', () => {
      if (currentMonth === 11) { currentMonth = 0; currentYear++; }
      else currentMonth++;
      renderCalendar();
    });

    // Back buttons
    document.getElementById('sched-back-1').addEventListener('click', () => goToStep(1));
    document.getElementById('sched-back-2').addEventListener('click', () => goToStep(2));

    // Close triggers
    document.getElementById('sched-close').addEventListener('click', closeModal);
    document.getElementById('sched-overlay').addEventListener('click', closeModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // Intercept ALL wa.me links (except the WA send button itself)
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
      if (link.id === 'sched-wa-btn') return;
      link.addEventListener('click', e => {
        e.preventDefault();
        openModal();
      });
    });

    // Also handle the floating WA icon (it's an <a> wrapping an <img>)
    // already covered above — but double-check any button that might be dynamically added
    document.addEventListener('click', e => {
      const link = e.target.closest('a[href*="wa.me"]');
      if (link && link.id !== 'sched-wa-btn') {
        e.preventDefault();
        openModal();
      }
    }, true);  // capture phase so it catches before default
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
