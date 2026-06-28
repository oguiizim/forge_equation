#include <bits/stdc++.h>
using namespace std;

struct Pl {
    double price;
    double grams;
};

int main() {
    int x, minutes, maintenance;
    double priceM, priceH, priceG, totalG, l, cost;
    totalG = 0;
    cin >> x;
    vector<Pl> colors;
    while(x--){
        double p, g;
        cin >> p >> g;
        colors.push_back({p, g});
    }
    for(auto i : colors){
        priceG = i.price / 1000;
        totalG += priceG * i.grams;
    }
    cin >> minutes >> priceH >> maintenance >> l;
    priceM = priceH / 60.0;
    double total;
    l = l / 100.0 + 1;
    cout << "Preco de custo: " << totalG << '\n';
    total = (minutes * priceM + totalG + maintenance) * l;
    cout << "Preco total: " <<  total << '\n';
}
