"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.querySelector(".site-header nav");
  const navMenu = document.getElementById("nav-menu");

  // Mobile navigation
  if (menuToggle && nav && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      nav.classList.toggle("is-open", !isOpen);
    });

    navMenu.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        nav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Reveal cards as they enter the viewport
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            currentObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  // Coffee order dialog
  const dialog = document.getElementById("order-dialog");
  const orderForm = document.getElementById("order-form");

  if (dialog && orderForm) {
    const itemName = document.getElementById("order-item");
    const unitPrice = document.getElementById("order-unit");
    const quantityInput = document.getElementById("order-qty");
    const totalOutput = document.getElementById("order-total");
    const nameInput = document.getElementById("order-name");
    const noteInput = document.getElementById("order-note");
    const status = document.getElementById("order-status");

    let selectedItem = "";
    let selectedPrice = 0;

    const updateTotal = () => {
      const quantity = Math.min(20, Math.max(1, Number(quantityInput.value) || 1));
      quantityInput.value = String(quantity);
      totalOutput.textContent = `$${(selectedPrice * quantity).toFixed(2)}`;
    };

    document.querySelectorAll("[data-order]").forEach((button) => {
      button.addEventListener("click", () => {
        selectedItem = button.dataset.item || "Coffee";
        selectedPrice = Number(button.dataset.price) || 0;

        itemName.textContent = selectedItem;
        unitPrice.textContent = `$${selectedPrice.toFixed(2)} each`;
        quantityInput.value = "1";
        nameInput.value = "";
        noteInput.value = "";
        status.textContent = "";
        updateTotal();

        if (typeof dialog.showModal === "function") {
          dialog.showModal();
          nameInput.focus();
        }
      });
    });

    quantityInput.addEventListener("input", updateTotal);

    dialog.querySelectorAll("[data-step]").forEach((button) => {
      button.addEventListener("click", () => {
        const step = Number(button.dataset.step) || 0;
        const current = Number(quantityInput.value) || 1;
        quantityInput.value = String(Math.min(20, Math.max(1, current + step)));
        updateTotal();
      });
    });

    dialog.querySelectorAll("[data-close]").forEach((button) => {
      button.addEventListener("click", () => dialog.close());
    });

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    orderForm.addEventListener("submit", (event) => {
      event.preventDefault();
      status.textContent = "";

      const customerName = nameInput.value.trim();
      const quantity = Number(quantityInput.value);

      if (!customerName) {
        status.textContent = "Please enter your name.";
        nameInput.focus();
        return;
      }

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        status.textContent = "Please choose a quantity from 1 to 20.";
        quantityInput.focus();
        return;
      }

      const total = (selectedPrice * quantity).toFixed(2);
      const note = noteInput.value.trim();
      const message = [
        "Coffee order",
        `Name: ${customerName}`,
        `Item: ${selectedItem}`,
        `Quantity: ${quantity}`,
        `Total: $${total}`,
        note ? `Notes: ${note}` : ""
      ].filter(Boolean).join("\n");

      // Replace with your shop's WhatsApp number, including country code.
      const whatsappNumber = "15551234567";
      const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      dialog.close();
    });
  }

  // Newsletter form: let the configured form endpoint handle submission.
  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (event) => {
      const action = newsletterForm.getAttribute("action") || "";
      if (action.includes("yourformid")) {
        event.preventDefault();
        const status = document.getElementById("news-status");
        if (status) {
          status.textContent =
            "Add your newsletter form endpoint before enabling subscriptions.";
        }
      }
    });
  }
});