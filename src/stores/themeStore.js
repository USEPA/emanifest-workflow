import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
    state: () => ({
        themeName: localStorage.getItem('theme') || 'light',
    }),
    getters: {
        isDark: (state) => state.themeName === 'dark',
        themeColor() {
            if (this.isDark) {
                return 'grey-darken-4'
            }
            return 'grey-lighten-3'
        },
        themeIcon() {
            if (this.isDark) {
                return 'mdi-white-balance-sunny'
            }
            return 'mdi-weather-night'
        }

    },
    actions: {
        toggleTheme() {
            this.themeName = this.isDark ? 'light' : 'dark';
            localStorage.setItem('theme', this.themeName);
        }

    }
})