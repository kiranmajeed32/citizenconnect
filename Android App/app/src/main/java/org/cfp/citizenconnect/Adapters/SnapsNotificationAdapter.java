package org.cfp.citizenconnect.Adapters;

import android.content.Context;
import android.net.Uri;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.facebook.drawee.view.SimpleDraweeView;

import org.cfp.citizenconnect.Model.Files;
import org.cfp.citizenconnect.R;

import java.util.List;

/**
 * Created by shahzaibshahid on 13/12/2017.
 */

public class SnapsNotificationAdapter extends RecyclerView.Adapter<SnapsNotificationAdapter.MyViewHolder> {

    List<Files> snapList;
    Context mContext;
    private LayoutInflater inflater;

    public SnapsNotificationAdapter(Context mContext, List<Files> snapList) {
        this.snapList = snapList;
        this.mContext = mContext;
        inflater = LayoutInflater.from(mContext);

    }

    @Override
    public MyViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.list_snap_layout, parent, false);

        return new MyViewHolder(itemView);
    }

    @Override
    public void onBindViewHolder(MyViewHolder holder, int position) {
        holder.snapHolder.setImageURI(Uri.parse(snapList.get(position).getUrl()));
        holder.title.setText(snapList.get(position).getTitle());
        holder.time.setText(snapList.get(position).getTime());
    }

    @Override
    public int getItemCount() {
        return snapList.size();
    }

    public class MyViewHolder extends RecyclerView.ViewHolder {

        SimpleDraweeView snapHolder;
        TextView title;
        TextView time;

        public MyViewHolder(final View itemView) {
            super(itemView);
            snapHolder = (SimpleDraweeView) itemView.findViewById(R.id.snapHolder);
            title = (TextView) itemView.findViewById(R.id.snapTitle);
            time = (TextView) itemView.findViewById(R.id.notificationTime);
        }
    }
}
