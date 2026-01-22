import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
    state: () => ({
        themeName: localStorage.getItem('theme') || 'light',
    }),
    getters: {
        isDark: (state) => state.themeName === 'dark',
        themeColor() {
            if (this.isDark) {
                return ''
            }
            return 'grey-lighten-3'
        },
        linkColor() {
            if (this.isDark) {
                return 'text-primary-darken-2'
            }
            return 'text-primary-lighten-4'
        },
        themeIcon() {
            if (this.isDark) {
                return 'mdi-white-balance-sunny'
            }
            return 'mdi-weather-night'
        },
        homeTopColor(){
             if (this.isDark) {
                return 'bg-grey-darken-4'
            }
            return 'bg-grey-lighten-2'
        }
    },
    actions: {
        toggleTheme() {
            this.themeName = this.isDark ? 'light' : 'dark';
            localStorage.setItem('theme', this.themeName);
        }
    }
})