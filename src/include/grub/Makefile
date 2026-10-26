CC      = gcc
AS      = as
LD      = ld

CFLAGS  = -m32 -std=gnu11 -ffreestanding -O2 -Wall -Wextra -fno-stack-protector -fno-pie -fno-pic -Iinclude
ASFLAGS = --32
LDFLAGS = -m elf_i386 -T linker.ld -nostdlib

BUILD   = build
ISO_DIR = $(BUILD)/isodir

.PHONY: all iso run clean

all: iso

$(BUILD):
	mkdir -p $(BUILD)

$(BUILD)/boot.o: src/boot.s | $(BUILD)
	$(AS) $(ASFLAGS) $< -o $@

$(BUILD)/kernel.o: src/kernel.c include/kernel.h | $(BUILD)
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILD)/kernel.elf: $(BUILD)/boot.o $(BUILD)/kernel.o linker.ld
	$(LD) $(LDFLAGS) -o $@ $(BUILD)/boot.o $(BUILD)/kernel.o

iso: $(BUILD)/kernel.elf
	mkdir -p $(ISO_DIR)/boot/grub
	cp $(BUILD)/kernel.elf $(ISO_DIR)/boot/kernel.elf
	cp grub/grub.cfg $(ISO_DIR)/boot/grub/grub.cfg
	grub-mkrescue -o $(BUILD)/proOS.iso $(ISO_DIR)

run: iso
	qemu-system-i386 -cdrom $(BUILD)/proOS.iso

clean:
	rm -rf $(BUILD)
