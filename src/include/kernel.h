#ifndef PROOS_KERNEL_H
#define PROOS_KERNEL_H

#include <stddef.h>
#include <stdint.h>

void terminal_initialize(void);
void terminal_setcolor(uint8_t color);
void terminal_writestring(const char *data);
void kernel_main(void);

#endif
