#include "kernel.h"

#define VGA_WIDTH 80
#define VGA_HEIGHT 25
#define VGA_MEMORY ((volatile uint16_t *)0xB8000)

static size_t terminal_row;
static size_t terminal_column;
static uint8_t terminal_color;
static volatile uint16_t *terminal_buffer;

static uint8_t vga_entry_color(uint8_t fg, uint8_t bg)
{
    return (uint8_t)(fg | (bg << 4));
}

static uint16_t vga_entry(unsigned char c, uint8_t color)
{
    return (uint16_t)c | ((uint16_t)color << 8);
}

void terminal_setcolor(uint8_t color)
{
    terminal_color = color;
}

void terminal_initialize(void)
{
    terminal_row = 0;
    terminal_column = 0;
    terminal_color = vga_entry_color(7, 0);
    terminal_buffer = VGA_MEMORY;

    for (size_t y = 0; y < VGA_HEIGHT; y++) {
        for (size_t x = 0; x < VGA_WIDTH; x++) {
            terminal_buffer[y * VGA_WIDTH + x] =
                vga_entry(' ', terminal_color);
        }
    }
}

static void terminal_scroll(void)
{
    for (size_t y = 1; y < VGA_HEIGHT; y++) {
        for (size_t x = 0; x < VGA_WIDTH; x++) {
            terminal_buffer[(y - 1) * VGA_WIDTH + x] =
                terminal_buffer[y * VGA_WIDTH + x];
        }
    }

    for (size_t x = 0; x < VGA_WIDTH; x++) {
        terminal_buffer[(VGA_HEIGHT - 1) * VGA_WIDTH + x] =
            vga_entry(' ', terminal_color);
    }

    terminal_row = VGA_HEIGHT - 1;
}

static void terminal_putchar(char c)
{
    if (c == '\n') {
        terminal_column = 0;
        terminal_row++;
    } else if (c == '\r') {
        terminal_column = 0;
    } else {
        terminal_buffer[
            terminal_row * VGA_WIDTH + terminal_column
        ] = vga_entry((unsigned char)c, terminal_color);

        terminal_column++;

        if (terminal_column >= VGA_WIDTH) {
            terminal_column = 0;
            terminal_row++;
        }
    }

    if (terminal_row >= VGA_HEIGHT) {
        terminal_scroll();
    }
}

void terminal_writestring(const char *data)
{
    if (data == NULL) {
        return;
    }

    for (size_t i = 0; data[i] != '\0'; i++) {
        terminal_putchar(data[i]);
    }
}

void kernel_main(void)
{
    terminal_initialize();

    terminal_setcolor(vga_entry_color(2, 0));

    terminal_writestring(
        "========================================\n"
        "               proOS                    \n"
        "========================================\n\n"
    );

    terminal_setcolor(vga_entry_color(15, 0));

    terminal_writestring("Boot successful.\n");
    terminal_writestring("Kernel: C\n");
    terminal_writestring("Architecture: x86 32-bit\n\n");

    terminal_setcolor(vga_entry_color(11, 0));
    terminal_writestring("Welcome to proOS.\n");

    terminal_setcolor(vga_entry_color(7, 0));

    terminal_writestring(
        "System initialized successfully.\n"
        "Future modules:\n"
        " - Keyboard input\n"
        " - Memory management\n"
        " - Command shell\n"
        " - Filesystem\n"
        " - Graphics\n"
    );

    for (;;) {
        __asm__ volatile ("hlt");
    }
}
