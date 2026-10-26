# proOS

A minimal freestanding operating system kernel written in C.

## Features

- GRUB Multiboot boot process
- 32-bit x86 kernel
- VGA text console
- Colored terminal output
- Automatic terminal scrolling
- Freestanding C kernel

## Build

Install GCC, binutils, GRUB utilities, xorriso and QEMU.

Run:

    make

Launch the OS in QEMU:

    make run

## Roadmap

- Keyboard driver
- Interactive shell
- Physical memory manager
- Paging and virtual memory
- Interrupt handling
- Filesystem
- Graphics and window manager
