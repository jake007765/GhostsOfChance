package Pandemonium;

import java.util.ArrayList;

public class Demon implements Comparable<Demon>{

    protected int mesh;
    protected String name;
    protected String title;
    protected double pitch;


    protected ArrayList<Integer> stats;


    Demon(int mesh, String name, String title) {
        this.mesh = mesh;
        this.name = name;
        this.title = title;
        ArrayList<Integer> stats = new ArrayList<Integer>();
    }



    @Override
    public String toString() {
        
        return "Mesh: " + mesh + " " + name + "\n" + stats
        ;
    }



    @Override
    public int compareTo(Demon o) {
        return this.mesh - o.mesh;
    }
}

