import tkinter
import random
import math
from typing import Counter
mx = 0
my = 0
cx = 0
cy = 0
good_count = 0
test_counter = 0
player_count = 1
ban_main = []
ban_sub = []
mouse_tap = ""
fun = ("Time New Roman", 30)
def map_set():
    for i in range(11):
        ban_main.append([0,0,0,0,0,0,0,0,0,0])
        ban_sub.append([0,0,0,0,0,0,0,0,0,0])
        if i == 3:
            ban_main[i][3] =2
            ban_main[i][4] = 1
        elif i == 4:
            ban_main[i][3] = 1
            ban_main[i][4] = 2
def mouse_move(e):
    global mx, my
    mx = e.x
    my = e.y
def mouse_cric(e):
    global mouse_tap, player_count
    if ban_main[cy][cx] == 0:
            mouse_tap = 1
            set_Circle()
            print("te")
            if player_count == 1:
                player_count = 2+1
                print(player_count)####################ここで２になった後すぐ1にされてる
            if player_count == 2:
                player_count = 1+3
            if player_count == 3:
                player_count -= 1
            if player_count == 4:
                player_count -= 3
            if player_count == 2:
                print("faaaaa1")
                revese_black()
            if player_count == 1:
                print("faaaaaaa2")
                revese_white()
            #reverse_algorithm()
            write_Circle()
            koma_count()
            #okeru_okenai_sensor()
            #print(mouse_tap)
def mouse_release(e):
    global mouse_tap
    mouse_tap = 0
def set_Circle():
    global mx, my, cy, cx, mouse_tap, player_count
    senser()
    print("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    print(good_count)
    if mouse_tap == 1 and 3 <= mx and mx <= 603 and my >= 3 and my <= 603:
        if not(test_counter==8):
            if player_count == 1:
                ban_main[cy][cx] = 1
                mouse_tap = 0
                write_Circle()
                #player_count = 2
            if player_count == 2:
                ban_main[cy][cx] = 2
                mouse_tap = 0
                write_Circle()
                #player_count = 1
def write_Circle():
    global ban_main, ban_sub, player_count
    c.delete("KOMA")
    for y in range(8):
        for x in range(8):
            if ban_main[y][x] == 1:
                c.create_oval(x*75, y*75, x*75+75, y*75+75, fill = "black",tag = "KOMA")
                #print("test")
                #player_count = 2
            if ban_main[y][x] == 2:
                c.create_oval(x*75, y*75, x*75+75, y*75+75, fill = "white",tag = "KOMA")
                #print("test")
                #player_count = 1
    #a.after(100, write_Circle)

def pas_sensor():
    global cx, cy
    if player_count == 1:
        print("test2")
def senser():
    global good_count
    good_count = 0
    if player_count ==1:
        if ban_main[cy+1][cx] == 0 or ban_main[cy+1][cx] == 1:
            good_count +=1
            print("1")
        if ban_main[cy-1][cx]==0 or ban_main[cy-1][cx] ==1:
            good_count+=1
            print("2")
        if ban_main[cy][cx+1]==0 or ban_main[cy][cx+1]==1:
            good_count +=1
            print("3")
        if ban_main[cy][cx-1] == 0 or ban_main[cy][cx-1] ==1:
            good_count+=1
            print("4")
        if ban_main[cy+1][cx+1] == 0 or ban_main[cy+1][cx+1] ==1:
            good_count +=1
            print("5")
        if ban_main[cy+1][cx-1]== 0 or ban_main[cy+1][cx-1] == 1:
            good_count +=1
            print("6")
        if ban_main[cy-1][cx+1] == 0 or ban_main[cy-1][cx+1]==1:
            good_count+=1
            print("7")
        if ban_main[cy-1][cx-1]== 0 or ban_main[cy-1][cx-1] == 1:
            good_count+=1
            print("8")
def mouse_move_GUI():
    global cx, cy, mx, my
    c.delete("POINT")
    if 3 <= mx and mx <= 603 and my >= 3 and my <= 603:
        cy = int((my-3)/75)#縦から何個目か
        cx = int((mx-3)/75)#横から何個目か
    #print(cy)
    #print(cx)
    c.create_rectangle(cx*75, cy*75, (cx*75)+75, (cy*75)+75, fill = "black", outline="black", width = 3, tag = "POINT")
    a.after(100, mouse_move_GUI)
def reverse_algorithm():
    global cx, cy, mx, my, test_counter
    test_counter = 0
    koma_count = 0
    if ban_main[cy][cx] == 1:
        if ban_main[cy][cx+1] == 2:
            while ban_main[cy][cx+koma_count] == 1:
                koma_count = koma_count + 1
                if cx+koma_count > 7:#######8になるかもしれない
                    break
        if ban_main[cy][cx-1] == 2:
            koma_count = 0
            while ban_main[cy][cx-koma_count] == 1:
                koma_count = koma_count+ 1
                if cx-koma_count < 0:
                    break
        if ban_main[cy+1][cx] == 2:
            koma_count = 0
            while ban_main[cy+koma_count][cx] == 1:
                koma_count = koma_count + 1
                if cy+koma_count > 7:###8になるかもしれない
                    break
        if ban_main[cy-1][cx] == 2:
            koma_count = 0
            test_counter = 0
            while ban_main[cy-koma_count][cx] == 1:
                koma_count + 1
                ban_main[cy-koma_count][cx] = 1
                if cy-koma_count < 0:
                    for i in range(koma_count):
                        #koma_count  = koma_count - 1
                        if ban_main[cy-i][cx] == 1:
                            ban_main[cy-i][cx] = 2
                    break
def revese_black():
    global cx, cy, test_counter
    koma_count = 1
    if ban_main[cy][cx] == 1:
        if ban_main[cy-1][cx] == 2:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while True:
                koma_count += 1
                if ban_main[cy-koma_count][cx] == 1:
                    print("fa1")
                    break
                if ban_main[cy-koma_count][cx]==0:
                    print("fa2")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy-sub_counter][cx] == 1:
                            ban_main[cy-sub_counter][cx] = 2
                    break
                if ban_main[cy-koma_count][cx] == 2:
                    ban_main[cy-koma_count][cx] = 1
                if cy-koma_count < 0:
                    for i in range(koma_count):
                        koma_count  = koma_count - 1
                        if ban_main[cy-i][cx] == 1:
                            ban_main[cy-i][cx] = 2
                    break
                #########################################
        if ban_main[cy+1][cx] == 2:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while ban_main[cy+koma_count][cx] == 1:
                koma_count +=1
                if ban_main[cy+koma_count][cx] == 1:
                    print("fa1s")
                    break
                if ban_main[cy+koma_count][cx]==0:
                    print("fa2s")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy+sub_counter][cx] == 1:
                            ban_main[cy+sub_counter][cx] = 2
                    break
                if ban_main[cy+koma_count][cx] == 2:
                    ban_main[cy+koma_count][cx] = 1
                if cy+koma_count < 0:
                    for i in range(koma_count):
                        koma_count  = koma_count + 1
                        if ban_main[cy+i][cx] == 1:
                            ban_main[cy+i][cx] = 2
                    break
        ########################################################
        if ban_main[cy][cx+1] == 2:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while ban_main[cy][cx+koma_count] == 1:
                koma_count +=1
                if ban_main[cy][cx+koma_count] == 1:
                    print("fa1s")
                    break
                if ban_main[cy][cx+koma_count]==0:
                    print("fa2s")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy][cx+sub_counter] == 1:
                            ban_main[cy][cx+sub_counter] = 2
                    break
                if ban_main[cy][cx+koma_count] == 2:
                    ban_main[cy][cx+koma_count] = 1
                if cx+koma_count < 0:
                    for i in range(koma_count):
                        koma_count  = koma_count + 1
                        if ban_main[cy][cx+i] == 1:
                            ban_main[cy][cx+i] = 2
                    break
        ##############################################################
        if ban_main[cy][cx-1] == 2:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while ban_main[cy][cx-koma_count] == 1:
                koma_count +=1
                if ban_main[cy][cx-koma_count] == 1:
                    print("fa1s")
                    break
                if ban_main[cy][cx-koma_count]==0:
                    print("fa2s")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy][cx-sub_counter] == 1:
                            ban_main[cy][cx-sub_counter] = 2
                    break
                if ban_main[cy][cx-koma_count] == 2:
                    ban_main[cy][cx-koma_count] = 1
                if cx-koma_count < 0:
                    for i in range(koma_count):
                        koma_count  = koma_count + 1
                        if ban_main[cy][cx-i] == 1:
                            ban_main[cy][cx-i] = 2
                    break
    #################################################################
        if ban_main[cy+1][cx+1] == 2:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while ban_main[cy+koma_count][cx+koma_count] == 1:
                koma_count +=1
                if ban_main[cy+koma_count][cx+koma_count] == 1:
                    print("fa1s")################################################成功
                    break
                if ban_main[cy+koma_count][cx+koma_count]==0:
                    print("fa2s")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy+sub_counter][cx+sub_counter] == 1:
                            ban_main[cy+sub_counter][cx+sub_counter] = 2
                    break
                if ban_main[cy+koma_count][cx+koma_count] == 2:
                    ban_main[cy+koma_count][cx+koma_count] = 1
                if ban_main[cy+koma_count][cx+koma_count] == 0 or cx+koma_count <0 or cy+koma_count< 0:
                    for i in range(koma_count):
                        koma_count  = koma_count + 1
                        if ban_main[cy+i][cx+i] == 1:
                            ban_main[cy+i][cx+i] = 2
                    break
    #################################################################################################
        if ban_main[cy-1][cx-1] == 2:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while ban_main[cy-koma_count][cx-koma_count] == 1:
                koma_count +=1
                if ban_main[cy-koma_count][cx-koma_count] == 1:
                    print("fa1s")################################################成功
                    break
                if ban_main[cy-koma_count][cx-koma_count]==0:
                    print("fa2s")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy-sub_counter][cx-sub_counter] == 1:
                            ban_main[cy-sub_counter][cx-sub_counter] = 2
                    break
                if ban_main[cy-koma_count][cx-koma_count] == 2:
                    ban_main[cy-koma_count][cx-koma_count] = 1
                if ban_main[cy-koma_count][cx-koma_count] == 0 or cx-koma_count <0 or cy-koma_count< 0:
                    for i in range(koma_count):
                        koma_count  = koma_count + 1
                        if ban_main[cy-i][cx-i] == 1:
                            ban_main[cy-i][cx-i] = 2
                    break
    ########################################################################################################3
        if ban_main[cy+1][cx-1] == 2:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while ban_main[cy+koma_count][cx-koma_count] == 1:
                koma_count +=1
                if ban_main[cy+koma_count][cx-koma_count] == 1:
                    print("fa1s")################################################成功
                    break
                if ban_main[cy+koma_count][cx-koma_count]==0:
                    print("fa2s")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy+sub_counter][cx-sub_counter] == 1:
                            ban_main[cy+sub_counter][cx-sub_counter] = 2
                    break
                if ban_main[cy+koma_count][cx-koma_count] == 2:
                    ban_main[cy+koma_count][cx-koma_count] = 1
                if ban_main[cy+koma_count][cx-koma_count] == 0 or cx-koma_count <0 or cy+koma_count< 0:
                    for i in range(koma_count):
                        koma_count  = koma_count + 1
                        if ban_main[cy+i][cx-i] == 1:
                            ban_main[cy+i][cx-i] = 2
                    break
    ###########################################################################################################
        if ban_main[cy-1][cx+1] == 2:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while ban_main[cy-koma_count][cx+koma_count] == 1:
                koma_count +=1
                if ban_main[cy-koma_count][cx+koma_count] == 1:
                    print("fa1s")################################################成功
                    break
                if ban_main[cy-koma_count][cx+koma_count]==0:
                    print("fa2s")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy-sub_counter][cx+sub_counter] == 1:
                            ban_main[cy-sub_counter][cx+sub_counter] = 2
                    break
                if ban_main[cy-koma_count][cx+koma_count] == 2:
                    ban_main[cy-koma_count][cx+koma_count] = 1
                if ban_main[cy-koma_count][cx+koma_count] == 0 or cx+koma_count <0 or cy-koma_count< 0:
                    for i in range(koma_count):
                        koma_count  = koma_count + 1
                        if ban_main[cy-i][cx+i] == 1:
                            ban_main[cy-i][cx+i] = 2
                    break
def revese_white():
    global cx, cy, test_counter
    koma_count = 1
    if ban_main[cy][cx] == 2:
        if ban_main[cy-1][cx] == 1:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while True:
                koma_count += 1
                if ban_main[cy-koma_count][cx] == 2:
                    print("fa1")
                    break
                if ban_main[cy-koma_count][cx]==0:
                    print("fa2")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy-sub_counter][cx] == 2:
                            ban_main[cy-sub_counter][cx] = 1
                    break
                if ban_main[cy-koma_count][cx] == 1:
                    ban_main[cy-koma_count][cx] = 2
                if cy-koma_count < 0:
                    for i in range(koma_count):
                        koma_count  = koma_count - 1
                        if ban_main[cy-i][cx] == 2:
                            ban_main[cy-i][cx] = 1
                    break
                #########################################
        if ban_main[cy+1][cx] == 1:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while ban_main[cy+koma_count][cx] == 2:
                koma_count +=1
                if ban_main[cy+koma_count][cx] == 2:
                    print("fa1s")
                    break
                if ban_main[cy+koma_count][cx]==0:
                    print("fa2s")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy+sub_counter][cx] == 2:
                            ban_main[cy+sub_counter][cx] = 1
                    break
                if ban_main[cy+koma_count][cx] == 1:
                    ban_main[cy+koma_count][cx] = 2
                if cy+koma_count < 0:
                    for i in range(koma_count):
                        koma_count  = koma_count + 1
                        if ban_main[cy+i][cx] == 2:
                            ban_main[cy+i][cx] = 1
                    break
        ########################################################
        if ban_main[cy][cx+1] == 1:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while ban_main[cy][cx+koma_count] == 2:
                koma_count +=1
                if ban_main[cy][cx+koma_count] == 2:
                    print("fa1s")
                    break
                if ban_main[cy][cx+koma_count]==0:
                    print("fa2s")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy][cx+sub_counter] == 2:
                            ban_main[cy][cx+sub_counter] = 1
                    break
                if ban_main[cy][cx+koma_count] == 1:
                    ban_main[cy][cx+koma_count] = 2
                if cx+koma_count < 0:
                    for i in range(koma_count):
                        koma_count  = koma_count + 1
                        if ban_main[cy][cx+i] == 2:
                            ban_main[cy][cx+i] = 1
                    break
        ##############################################################
        if ban_main[cy][cx-1] == 1:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while ban_main[cy][cx-koma_count] == 2:
                koma_count +=1
                if ban_main[cy][cx-koma_count] == 2:
                    print("fa1s")
                    break
                if ban_main[cy][cx-koma_count]==0:
                    print("fa2s")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy][cx-sub_counter] == 2:
                            ban_main[cy][cx-sub_counter] = 1
                    break
                if ban_main[cy][cx-koma_count] == 1:
                    ban_main[cy][cx-koma_count] = 2
                if cx-koma_count < 0:
                    for i in range(koma_count):
                        koma_count  = koma_count + 1
                        if ban_main[cy][cx-i] == 2:
                            ban_main[cy][cx-i] = 1
                    break
    #################################################################
        if ban_main[cy+1][cx+1] == 1:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while ban_main[cy+koma_count][cx+koma_count] == 2:
                koma_count +=1
                if ban_main[cy+koma_count][cx+koma_count] == 2:
                    print("fa1s")################################################成功
                    break
                if ban_main[cy+koma_count][cx+koma_count]==0:
                    print("fa2s")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy+sub_counter][cx+sub_counter] == 2:
                            ban_main[cy+sub_counter][cx+sub_counter] = 1
                    break
                if ban_main[cy+koma_count][cx+koma_count] == 1:
                    ban_main[cy+koma_count][cx+koma_count] = 2
                if ban_main[cy+koma_count][cx+koma_count] == 0 or cx+koma_count <0 or cy+koma_count< 0:
                    for i in range(koma_count):
                        koma_count  = koma_count + 1
                        if ban_main[cy+i][cx+i] == 2:
                            ban_main[cy+i][cx+i] = 1
                    break
    #################################################################################################
        if ban_main[cy-1][cx-1] == 1:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while ban_main[cy-koma_count][cx-koma_count] == 2:
                koma_count +=1
                if ban_main[cy-koma_count][cx-koma_count] == 2:
                    print("fa1s")################################################成功
                    break
                if ban_main[cy-koma_count][cx-koma_count]==0:
                    print("fa2s")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy-sub_counter][cx-sub_counter] == 2:
                            ban_main[cy-sub_counter][cx-sub_counter] = 1
                    break
                if ban_main[cy-koma_count][cx-koma_count] == 1:
                    ban_main[cy-koma_count][cx-koma_count] = 2
                if ban_main[cy-koma_count][cx-koma_count] == 0 or cx-koma_count <0 or cy-koma_count< 0:
                    for i in range(koma_count):
                        koma_count  = koma_count + 1
                        if ban_main[cy-i][cx-i] == 2:
                            ban_main[cy-i][cx-i] = 1
                    break
    ########################################################################################################3
        if ban_main[cy+1][cx-1] == 1:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while ban_main[cy+koma_count][cx-koma_count] == 2:
                koma_count +=1
                if ban_main[cy+koma_count][cx-koma_count] == 2:
                    print("fa1s")################################################成功
                    break
                if ban_main[cy+koma_count][cx-koma_count]==0:
                    print("fa2s")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy+sub_counter][cx-sub_counter] == 2:
                            ban_main[cy+sub_counter][cx-sub_counter] = 1
                    break
                if ban_main[cy+koma_count][cx-koma_count] == 1:
                    ban_main[cy+koma_count][cx-koma_count] = 2
                if ban_main[cy+koma_count][cx-koma_count] == 0 or cx-koma_count <0 or cy+koma_count< 0:
                    for i in range(koma_count):
                        koma_count  = koma_count + 1
                        if ban_main[cy+i][cx-i] == 2:
                            ban_main[cy+i][cx-i] = 1
                    break
    ###########################################################################################################
        if ban_main[cy-1][cx+1] == 1:
            koma_count = 0
            test_counter = 0
            sub_counter = 0
            while ban_main[cy-koma_count][cx+koma_count] == 2:
                koma_count +=1
                if ban_main[cy-koma_count][cx+koma_count] == 2:
                    print("fa1s")################################################成功
                    break
                if ban_main[cy-koma_count][cx+koma_count]==0:
                    print("fa2s")
                    sub_counter = 0
                    for i in range(koma_count):
                        koma_count  = sub_counter
                        sub_counter = sub_counter+1
                        if ban_main[cy-sub_counter][cx+sub_counter] == 2:
                            ban_main[cy-sub_counter][cx+sub_counter] = 1
                    break
                if ban_main[cy-koma_count][cx+koma_count] == 1:
                    ban_main[cy-koma_count][cx+koma_count] = 2
                if ban_main[cy-koma_count][cx+koma_count] == 0 or cx+koma_count <0 or cy-koma_count< 0:
                    for i in range(koma_count):
                        koma_count  = koma_count + 1
                        if ban_main[cy-i][cx+i] == 2:
                            ban_main[cy-i][cx+i] = 1
                    break
koma_counter_black = 0
koma_counter_white = 0
def koma_count():
    global koma_counter, koma_counter_black, koma_counter_white
    koma_counter_black = 0
    koma_counter_white = 0
    c.delete("TEXT")
    for y in range(10):
        for x in range(10):
            if ban_main[y][x] == 1:
                koma_counter_black = koma_counter_black +1
            if ban_main[y][x] ==2:
                koma_counter_white = koma_counter_white +1
    scoer_bode()
    print(koma_counter_black)
    print(koma_counter_white)
def play_count():
    global player_count
    player_count = 1
def scoer_bode():
    global koma_counter_black, koma_counter_white
    c.create_text(100, 650, text = koma_counter_black, font = fun, tag = "TEXT")
    c.create_text(200, 650, text = koma_counter_white, font = fun, tag = "TEXT")
def pas():
    global player_count
    if player_count ==1:
        player_count += 2
    if player_count == 2:
        player_count -=1
    if player_count == 3:
        player_count = 2
def main():
    #play_count()
    map_set()
    map_write()
    mouse_move_GUI()
    set_Circle()
    write_Circle()
def map_write():
    c.delete("BAN")
    c.create_line(3, 0, 3, 603, fill = "black", width = 3, tag = "BAN")
    c.create_line(0, 3, 603,3, fill = "black", width = 3, tag = "BAN")
    c.create_line(600, 3, 600, 604, fill = "black", width=3, tag = "BAN")
    c.create_line(3, 603, 600, 603, fill = "black", width=3, tag = "BAN")
    c.create_line(75, 0, 75, 603, fill = "black", width = 3, tag = "BAN")
    c.create_line(150, 0, 150, 603, fill = "black", width = 3, tag = "BAN")
    c.create_line(225, 0, 225, 603, fill = "black", width = 3, tag = "BAN")
    c.create_line(300, 0, 300, 603, fill = "black", width = 3, tag = "BAN")
    c.create_line(375, 0, 375, 603, fill = "black", width = 3, tag = "BAN")
    c.create_line(450, 0, 450, 603, fill = "black", width = 3, tag = "BAN")
    c.create_line(525, 0, 525, 603, fill = "black", width = 3, tag = "BAN")
    c.create_line(0, 75, 603, 75, fill = "black", width = 3, tag = "BAN")
    c.create_line(0, 150, 603, 150, fill = "black", width = 3, tag = "BAN")
    c.create_line(0, 225, 603, 225, fill = "black", width = 3, tag = "BAN")
    c.create_line(0, 300, 603, 300, fill = "black", width = 3, tag = "BAN")
    c.create_line(0, 375, 603, 375, fill = "black", width = 3, tag = "BAN")
    c.create_line(0, 450, 603, 450, fill = "black", width = 3, tag = "BAN")
    c.create_line(0, 525, 603, 525, fill = "black", width = 3, tag = "BAN")
    c.create_oval(25,625,75,675, fill = "black",tag = "SUMPLE")
    c.create_oval(125, 625, 175, 675, fill = "white", tag = "SUMPLE")
    button = tkinter.Button(a, text = "パス", width = 15,command=pas)
    button.place(x = 300, y = 625)
a = tkinter.Tk()
a.title("リバーシ")
c = tkinter.Canvas(a, width = 600, height = 700, bg = "green")
c.pack()
print(ban_main)
print(ban_sub)
a.bind("<Motion>", mouse_move)
a.bind("<Button-1>", mouse_cric)
main()
a.mainloop()
