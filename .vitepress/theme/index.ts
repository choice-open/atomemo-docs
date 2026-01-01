import { nextTick, onMounted, watch } from "vue"
import { inBrowser, useRoute } from "vitepress"
import DefaultTheme from "vitepress/theme"
import "./custom.css"

export default {
  extends: DefaultTheme,

  // sync the tab selection state across code groups
  setup() {
    if (inBrowser) {
      const route = useRoute()

      // Click on the tab with the given label text
      function showCodeWithLabel(labelText: unknown) {
        document.querySelectorAll(`.vp-code-group .tabs label`).forEach((label) => {
          if (!(label instanceof HTMLElement)) return

          if (label.innerText === labelText) {
            const input = document.getElementById(label.getAttribute("for")!)

            if (input instanceof HTMLInputElement && !input.checked) {
              label.click()
            }
          }
        })
      }

      let preventScroll = false

      function bindClickEvents() {
        // Find all the labels
        const labels = document.querySelectorAll(".vp-code-group .tabs label")

        labels.forEach((label) => {
          if (!(label instanceof HTMLElement)) return

          label.addEventListener("click", ($event) => {
            const labelFor = label.getAttribute("for")
            const initialRect = label.getBoundingClientRect()
            const initialScrollY = window.scrollY

            // Save the selected tab
            localStorage.setItem("codeGroupTab", label.innerText)

            // Show the selected tab on each code group
            showCodeWithLabel(label.innerText)

            // Use nextTick to ensure DOM is updated and scroll to the position
            // so that the clicked label is at the same position as before
            nextTick(() => {
              if (preventScroll || !$event.isTrusted) {
                return
              }

              // Find the new position of the label
              const labelNew = document.querySelector(`label[for="${labelFor}"]`)
              if (labelNew instanceof HTMLElement) {
                const newRect = labelNew.getBoundingClientRect()

                // Calculate the difference in position relative to the document
                const yDiff = newRect.top + window.scrollY - (initialRect.top + initialScrollY)

                // Scroll to maintain the label's position
                scrollToY(initialScrollY + yDiff)
              }
            })
          })
        })
      }

      // Scroll to the given Y position without animation
      function scrollToY(y: number) {
        window.scrollTo({
          top: y,
          behavior: "instant",
        })
      }

      // Select the given tab and scroll to the top of the page
      function selectTabAndScrollToTop(tab: unknown) {
        if (!tab) {
          return
        }

        // Restore the last selected tab and scroll back to to top
        // Enable 'preventScroll' to avoid scrolling to all the tabs
        preventScroll = true
        showCodeWithLabel(tab)
        nextTick(() => {
          preventScroll = false
          scrollToY(0)
        })
      }

      // Bind click event on initial page and restore the last selected tab
      onMounted(() =>
        nextTick(() => {
          bindClickEvents()
          selectTabAndScrollToTop(localStorage.getItem("codeGroupTab"))
        }),
      )

      watch(
        () => route.path,
        () => {
          nextTick(() => {
            // Bind click event on new page
            bindClickEvents()
            selectTabAndScrollToTop(localStorage.getItem("codeGroupTab"))
          })
        },
      )
    }
  },
}
