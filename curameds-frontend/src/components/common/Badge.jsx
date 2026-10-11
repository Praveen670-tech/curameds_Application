import React from 'react';

export default function Badge({ variant = 'info', children, icon: Icon }) {
  let badgeClass = 'badge-info';
  if (variant === 'success' || variant === 'VERIFIED' || variant === 'AVAILABLE' || variant === 'COMPLETED' || variant === 'ACTIVE') {
    badgeClass = 'badge-success';
  } else if (variant === 'warning' || variant === 'PENDING' || variant === 'SCHEDULED') {
    badgeClass = 'badge-warning';
  } else if (variant === 'danger' || variant === 'REJECTED' || variant === 'EXPIRED' || variant === 'DISPOSED') {
    badgeClass = 'badge-danger';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}
