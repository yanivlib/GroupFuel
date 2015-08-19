package com.mty.groupfuel;

import android.content.Context;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.mty.groupfuel.datamodel.Car;
import com.parse.ParseUser;

import java.util.Map;

public class CarItem extends RelativeLayout {
    private final static String STARTING_MILEAGE = "startingMileage";
    private final static String TOTAL_PRICE = "totalPrice";
    private final static String TOTAL_AMOUNT = "totalAmount";
    private final static String NUM_OF_EVENTS = "numOfEvents";
    private final static String CURRENT_MILEAGE = "currentMileage";
    private TextView header;
    private TextView mileage;
    private TextView mpg;
    private TextView dpg;
    private TextView owner;

    public CarItem(Context context) {
        this(context, null);
    }

    public CarItem(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public CarItem(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        LayoutInflater.from(context).inflate(R.layout.usage_car_item_children, this, true);
        setupChildren();
    }

    public static CarItem inflate(ViewGroup parent) {
        CarItem carItem = (CarItem) LayoutInflater.from(parent.getContext())
                .inflate(R.layout.usage_car_item, parent, false);
        return carItem;
    }

    public String getHeader() {
        return header.getText().toString();
    }

    public void setHeader(String name) {
        this.header.setText(name);
    }

    public void setMileage(String mileage) {
        this.mileage.setText(mileage);
    }

    public void setMpg(String mpg) {
        this.mpg.setText(mpg);
    }

    public void setDpg(String dpg) {
        this.dpg.setText(dpg);
    }

    private void setupChildren() {
        this.header = (TextView)findViewById(R.id.usage_car_title);
        this.mileage = (TextView)findViewById(R.id.usage_mileage);
        this.mpg = (TextView)findViewById(R.id.usage_mpg);
        this.dpg = (TextView)findViewById(R.id.usage_dpg);
        this.owner = (TextView) findViewById(R.id.usage_owner);
    }

    public void setData(Car car, Map<String, Number> map) {
        Number price = map.get(TOTAL_PRICE);
        Number amount = map.get(TOTAL_AMOUNT);
        Number starting = map.get(STARTING_MILEAGE);
        Number mileage = map.get(CURRENT_MILEAGE);

        int miles = (mileage.intValue() - starting.intValue());
        int intPrice = price.intValue();
        if (intPrice == 0) {
            intPrice++;
        }
        int intAmount = amount.intValue();
        if (intAmount == 0) {
            intAmount++;
        }
        String dpg = String.valueOf(miles / intPrice);
        String mpg = String.valueOf(miles / intAmount);

        if (car.getOwner().equals(ParseUser.getCurrentUser())) {
            owner.setText(R.string.me);
        } else {
            owner.setText(car.getOwner().getDisplayName());
        }
        setHeader(car.getDisplayName());
        setMileage(mileage.toString());
        setDpg(dpg);
        setMpg(mpg);
    }
}